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
        this.init();
    }

    // Inicializa la app y listeners
    init() {
        this.loadTasks();
        this.loadTheme();
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
            Swal.fire({
                icon: 'success',
                title: 'Tarea agregada',
                text: '¡Tu tarea ha sido creada exitosamente!',
                timer: 1200,
                showConfirmButton: false
            });
        }
    }

    // Elimina una tarea
    deleteTask(id) {
        if (window.Swal) {
            Swal.fire({
                title: '¿Eliminar tarea?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#fda085',
                cancelButtonColor: '#888',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                focusCancel: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.tasks = this.tasks.filter(task => task.id !== id);
                    this.saveTasks();
                    this.renderTasks();
                    Swal.fire({
                        icon: 'info',
                        title: 'Tarea eliminada',
                        text: 'La tarea fue eliminada.',
                        timer: 1200,
                        showConfirmButton: false
                    });
                }
            });
        } else {
            this.tasks = this.tasks.filter(task => task.id !== id);
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
            Swal.fire({
                icon: completed ? 'success' : 'warning',
                title: completed ? '¡Tarea completada!' : 'Tarea marcada como activa',
                text: completed ? '¡Buen trabajo!' : 'Puedes seguir trabajando en esta tarea.',
                timer: 1200,
                showConfirmButton: false
            });
        }
    }

    // Limpia tareas completadas
    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
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
        this.tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
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
        // Edición inline al hacer doble clic o Enter
        taskText.addEventListener('dblclick', () => this.editTaskInline(task, taskText, taskItem));
        taskText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.editTaskInline(task, taskText, taskItem);
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.setAttribute('aria-label', 'Delete task');
        deleteButton.tabIndex = 0;
        deleteButton.addEventListener('click', () => this.deleteTask(task.id));
        deleteButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.deleteTask(task.id);
            }
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        return taskItem;
    }

    // Edición inline de tareas
    editTaskInline(task, taskTextElem, taskItemElem) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-task-input';
        input.style.flex = '1';
        input.style.fontSize = '1rem';
        input.style.padding = '6px';
        input.style.border = '1px solid #fda085';
        input.style.borderRadius = '4px';
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveTaskEdit(task, input.value, taskTextElem, input);
            } else if (e.key === 'Escape') {
                taskItemElem.replaceChild(taskTextElem, input);
            }
        });
        input.addEventListener('blur', () => {
            this.saveTaskEdit(task, input.value, taskTextElem, input);
        });
        taskItemElem.replaceChild(input, taskTextElem);
        input.focus();
        input.select();
    }

    saveTaskEdit(task, newText, taskTextElem, inputElem) {
        const trimmed = newText.trim();
        if (trimmed && trimmed !== task.text) {
            this.tasks = this.tasks.map(t => t.id === task.id ? { ...t, text: trimmed } : t);
            this.saveTasks();
            this.renderTasks();
        } else {
            // Si no hay cambios, solo restaurar el texto
            inputElem.parentNode.replaceChild(taskTextElem, inputElem);
        }
    }

    // Renderiza las tareas
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('task-item', 'empty-message');
            emptyMessage.textContent = 'No tasks to display';
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
}

// Inicializa la app profesionalizada
new TaskManager();