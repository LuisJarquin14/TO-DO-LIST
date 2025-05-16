document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    // App State
    let tasks = [];
    let currentFilter = 'all';
    
    // Load tasks from localStorage
    const loadTasks = () => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    };
    
    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    // Add a new task
    const addTask = (text) => {
        if (text.trim() === '') return;
        
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        
        tasks.unshift(newTask); // Add to beginning of array
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    };
    
    // Delete a task
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };
    
    // Toggle task completion status
    const toggleTaskStatus = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    };
    
    // Clear all completed tasks
    const clearCompletedTasks = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };
    
    // Filter tasks based on current filter
    const getFilteredTasks = () => {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    };
    
    // Update tasks counter
    const updateTasksCounter = () => {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    };
    
    // Create task element
    const createTaskElement = (task) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        
        return taskItem;
    };
    
    // Render tasks to the DOM
    const renderTasks = () => {
        const filteredTasks = getFilteredTasks();
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('task-item', 'empty-message');
            emptyMessage.textContent = 'No tasks to display';
            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
        
        updateTasksCounter();
    };
    
    // Set active filter
    const setFilter = (filter) => {
        currentFilter = filter;
        
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderTasks();
    };
    
    // Event Listeners
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
    });
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setFilter(filter);
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Initialize app
    loadTasks();
});