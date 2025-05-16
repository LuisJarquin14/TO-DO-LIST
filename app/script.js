// Refactorización profesional: Modularización y uso de clase TaskManager

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');
        this.tasksCounter = document.getElementById('tasks-counter');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.langToggleBtn = document.getElementById('lang-toggle');
        this.init();
    }

    // Inicializa la app y listeners
    init() {
        this.loadTasks();
        this.loadTheme();
        this.applyLanguage();
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask(this.taskInput.value);
        });
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.setFilter(filter);
            });
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        if (this.langToggleBtn) {
            this.langToggleBtn.addEventListener('click', () => {
                const nextLang = this.lang === 'es' ? 'en' : 'es';
                this.setLanguage(nextLang);
            });
        }
    }

    // Carga tareas desde localStorage
    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        this.renderTasks();
    }

    // Guarda tareas en localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Añade una nueva tarea
    addTask(text) {
        if (text.trim() === '') return;
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
        // Alerta SweetAlert2
        if (window.Swal) {
            const t = this.lang === 'es' ? this.translations.es : this.translations.en;
            Swal.fire({
                icon: 'success',
                title: t.swalAddTitle,
                text: t.swalAddText,
                timer: 1200,
                showConfirmButton: false
            });
        }
    }

    // Elimina una tarea
    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        if (window.Swal) {
            const t = this.lang === 'es' ? this.translations.es : this.translations.en;
            Swal.fire({
                title: t.swalDeleteTitle,
                text: t.swalDeleteText,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#fda085',
                cancelButtonColor: '#888',
                confirmButtonText: t.swalDeleteConfirm,
                cancelButtonText: t.swalDeleteCancel,
                focusCancel: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.tasks = this.tasks.filter(t => t.id !== id);
                    this.saveTasks();
                    this.renderTasks();
                    Swal.fire({
                        icon: 'info',
                        title: t.swalDeleted,
                        text: t.swalDeletedText,
                        timer: 1200,
                        showConfirmButton: false
                    });
                }
            });
        } else {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Cambia el estado de completado
    toggleTaskStatus(id) {
        let completed = false;
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                completed = !task.completed;
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        this.saveTasks();
        this.renderTasks();
        // Alerta SweetAlert2
        if (window.Swal) {
            const t = this.lang === 'es' ? this.translations.es : this.translations.en;
            Swal.fire({
                icon: completed ? 'success' : 'warning',
                title: completed ? t.swalCompleted : t.swalActive,
                text: completed ? t.swalCompletedText : t.swalActiveText,
                timer: 1200,
                showConfirmButton: false
            });
        }
    }

    // Limpia tareas completadas
    clearCompletedTasks() {
        const t = this.lang === 'es' ? this.translations.es : this.translations.en;
        const completedCount = this.tasks.filter(task => task.completed).length;
        if (completedCount === 0) return;
        if (window.Swal) {
            Swal.fire({
                title: t.swalClearCompletedTitle,
                text: t.swalClearCompletedText,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: t.swalClearCompletedConfirm,
                cancelButtonText: t.swalClearCompletedCancel,
                confirmButtonColor: '#fda085',
                cancelButtonColor: '#888',
                focusCancel: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.tasks = this.tasks.filter(task => !task.completed);
                    this.saveTasks();
                    this.renderTasks();
                    Swal.fire({
                        icon: 'success',
                        title: t.swalClearCompletedSuccess,
                        text: t.swalClearCompletedSuccessText,
                        timer: 1200,
                        showConfirmButton: false
                    });
                }
            });
        } else {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Filtra tareas
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    // Actualiza el contador
    updateTasksCounter() {
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        const t = this.lang === 'es' ? this.translations.es : this.translations.en;
        this.tasksCounter.textContent = t.tasksLeft(activeTasks);
    }

    // Crea el elemento de tarea
    createTaskElement(task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('role', 'listitem');
        if (task.completed) taskItem.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task as completed');
        checkbox.tabIndex = 0;
        checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        taskText.tabIndex = 0;
        taskText.setAttribute('aria-label', 'Edit task');
        // Solo permitir edición si la tarea NO está completada
        if (!task.completed) {
            taskText.addEventListener('dblclick', () => this.editTaskInline(task, taskText, taskItem));
            taskText.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.editTaskInline(task, taskText, taskItem);
                }
            });
        }
        // Botón editar
        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.innerHTML = '<i class="fas fa-pen"></i>';
        editButton.setAttribute('aria-label', 'Edit task');
        editButton.tabIndex = 0;
        // Solo permitir editar si la tarea NO está completada
        if (!task.completed) {
            editButton.addEventListener('click', () => {
                const t = this.lang === 'es' ? this.translations.es : this.translations.en;
                if (window.Swal) {
                    Swal.fire({
                        title: t.swalEditTitle,
                        text: t.swalEditText,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: t.swalEditConfirm,
                        cancelButtonText: t.swalEditCancel,
                        confirmButtonColor: '#43cea2',
                        cancelButtonColor: '#888',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.editTaskInline(task, taskText, taskItem, true);
                        }
                    });
                } else {
                    this.editTaskInline(task, taskText, taskItem, true);
                }
            });
        } else {
            editButton.disabled = true;
            editButton.style.opacity = 0.5;
            editButton.style.cursor = 'not-allowed';
        }
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(editButton);
        return taskItem;
    }

    // Edición inline de tareas
    editTaskInline(task, taskTextElem, taskItemElem, showSaveIcon = false) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-task-input';
        input.style.flex = '1';
        input.style.fontSize = '1rem';
        input.style.padding = '6px';
        input.style.border = '1px solid #fda085';
        input.style.borderRadius = '4px';
        let saveBtn = null;
        let editBtn = taskItemElem.querySelector('.edit-btn');
        if (editBtn) editBtn.style.display = 'none';
        if (showSaveIcon) {
            saveBtn = document.createElement('button');
            saveBtn.className = 'save-btn';
            saveBtn.innerHTML = '<i class="fas fa-save"></i>';
            saveBtn.style.marginLeft = '8px';
            saveBtn.setAttribute('aria-label', 'Save task');
            saveBtn.addEventListener('click', () => {
                this.saveTaskEdit(task, input.value, taskTextElem, input, saveBtn, editBtn);
            });
        }
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveTaskEdit(task, input.value, taskTextElem, input, saveBtn, editBtn);
            } else if (e.key === 'Escape') {
                taskItemElem.replaceChild(taskTextElem, input);
                if (saveBtn) saveBtn.remove();
                if (editBtn) editBtn.style.display = '';
            }
        });
        input.addEventListener('blur', () => {
            if (!showSaveIcon) this.saveTaskEdit(task, input.value, taskTextElem, input, saveBtn, editBtn);
        });
        taskItemElem.replaceChild(input, taskTextElem);
        if (saveBtn) taskItemElem.appendChild(saveBtn);
        input.focus();
        input.select();
    }

    saveTaskEdit(task, newText, taskTextElem, inputElem, saveBtn, editBtn) {
        const trimmed = newText.trim();
        if (trimmed && trimmed !== task.text) {
            this.tasks = this.tasks.map(t => t.id === task.id ? { ...t, text: trimmed } : t);
            this.saveTasks();
            this.renderTasks();
            if (window.Swal) {
                const t = this.lang === 'es' ? this.translations.es : this.translations.en;
                Swal.fire({
                    icon: 'success',
                    title: t.swalEditSuccess,
                    text: t.swalEditSuccessText,
                    timer: 1200,
                    showConfirmButton: false
                });
            }
        } else {
            inputElem.parentNode.replaceChild(taskTextElem, inputElem);
            if (saveBtn) saveBtn.remove();
            if (editBtn) editBtn.style.display = '';
        }
        if (editBtn) editBtn.style.display = '';
        if (saveBtn) saveBtn.remove();
    }

    // Renderiza las tareas
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';
        const t = this.lang === 'es' ? this.translations.es : this.translations.en;
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('task-item', 'empty-message');
            emptyMessage.textContent = t.noTasks;
            this.taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                this.taskList.appendChild(taskElement);
            });
        }
        this.updateTasksCounter();
    }

    // Cambia el filtro
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-filter') === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
        this.renderTasks();
    }

    // --- Tema oscuro/claro ---
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme || 'light';
        document.body.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.updateThemeIcon(next);
    }

    updateThemeIcon(theme) {
        if (!this.themeToggleBtn) return;
        this.themeToggleBtn.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    // --- Cambio de idioma ---
    setLanguage(lang) {
        localStorage.setItem('lang', lang);
        this.lang = lang;
        this.applyLanguage();
        if (this.langToggleBtn) {
            this.langToggleBtn.setAttribute('aria-label', lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish');
        }
    }

    applyLanguage() {
        const t = this.lang === 'es' ? this.translations.es : this.translations.en;
        // El título principal NO cambia de idioma
        // Placeholder input
        this.taskInput.placeholder = t.addTaskPlaceholder;
        // Botón agregar
        document.getElementById('add-button').textContent = t.add;
        // Filtros
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length === 3) {
            filterBtns[0].textContent = t.all;
            filterBtns[1].textContent = t.active;
            filterBtns[2].textContent = t.completed;
        }
        // Botón limpiar completadas
        this.clearCompletedBtn.textContent = t.clearCompleted;
        // Botones de selección múltiple
        const multiDeleteBtn = document.getElementById('delete-selected-btn');
        if (multiDeleteBtn) multiDeleteBtn.textContent = t.deleteSelected;
        const multiRestoreBtn = document.getElementById('restore-selected-btn');
        if (multiRestoreBtn) multiRestoreBtn.textContent = t.restoreSelected;
        // Contador de tareas
        this.updateTasksCounter();
        // Mensajes vacíos
        this.renderTasks();
    }
    // Traducciones
    translations = {
        en: {
            todo: 'To-Do',
            addTaskPlaceholder: 'Add a new task...',
            add: 'Add',
            all: 'All',
            active: 'Active',
            completed: 'Completed',
            clearCompleted: 'Clear Completed',
            tasksLeft: n => `${n} task${n !== 1 ? 's' : ''} left`,
            noTasks: 'No tasks to display',
            swalAddTitle: 'Task added',
            swalAddText: 'Your task was created successfully!',
            swalDeleteTitle: 'Delete task?',
            swalDeleteText: 'This action cannot be undone.',
            swalDeleteConfirm: 'Yes, delete',
            swalDeleteCancel: 'Cancel',
            swalDeleted: 'Task deleted',
            swalDeletedText: 'The task was deleted.',
            swalCompleted: 'Task completed!',
            swalCompletedText: 'Good job!',
            swalActive: 'Task marked as active',
            swalActiveText: 'You can keep working on this task.',
            swalEditTitle: 'Edit task',
            swalEditText: 'Do you want to change the name of this task?',
            swalEditConfirm: 'Edit',
            swalEditCancel: 'Cancel',
            swalEditSuccess: 'Task updated',
            swalEditSuccessText: 'The task name was changed successfully!',
            swalClearCompletedTitle: 'Clear completed tasks?',
            swalClearCompletedText: 'If you continue, all completed tasks will be permanently deleted.',
            swalClearCompletedConfirm: 'Yes, clear',
            swalClearCompletedCancel: 'Cancel',
            swalClearCompletedSuccess: 'Completed tasks cleared',
            swalClearCompletedSuccessText: 'All completed tasks have been deleted.',
        },
        es: {
            todo: 'Tareas',
            addTaskPlaceholder: 'Agregar una nueva tarea...',
            add: 'Agregar',
            all: 'Todas',
            active: 'Activas',
            completed: 'Completadas',
            clearCompleted: 'Limpiar completadas',
            tasksLeft: n => `${n} tarea${n !== 1 ? 's' : ''} restante${n !== 1 ? 's' : ''}`,
            noTasks: 'No hay tareas para mostrar',
            swalAddTitle: 'Tarea agregada',
            swalAddText: '¡Tu tarea ha sido creada exitosamente!',
            swalDeleteTitle: '¿Eliminar tarea?',
            swalDeleteText: 'Esta acción no se puede deshacer.',
            swalDeleteConfirm: 'Sí, eliminar',
            swalDeleteCancel: 'Cancelar',
            swalDeleted: 'Tarea eliminada',
            swalDeletedText: 'La tarea fue eliminada.',
            swalCompleted: '¡Tarea completada!',
            swalCompletedText: '¡Buen trabajo!',
            swalActive: 'Tarea marcada como activa',
            swalActiveText: 'Puedes seguir trabajando en esta tarea.',
            swalEditTitle: 'Editar tarea',
            swalEditText: '¿Deseas cambiar el nombre de esta tarea?',
            swalEditConfirm: 'Editar',
            swalEditCancel: 'Cancelar',
            swalEditSuccess: 'Tarea actualizada',
            swalEditSuccessText: '¡El nombre de la tarea fue cambiado exitosamente!',
            swalClearCompletedTitle: '¿Limpiar tareas completadas?',
            swalClearCompletedText: 'Si continúas, todas las tareas completadas se eliminarán permanentemente.',
            swalClearCompletedConfirm: 'Sí, limpiar',
            swalClearCompletedCancel: 'Cancelar',
            swalClearCompletedSuccess: 'Tareas completadas eliminadas',
            swalClearCompletedSuccessText: 'Todas las tareas completadas han sido eliminadas.',
        }
    };
}

// Inicializa la app profesionalizada
new TaskManager();