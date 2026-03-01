// ============================
// TaskFlow — Frontend Logic
// ============================

const API_URL = '/api/tasks';

// DOM Elements
const taskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const loadingState = document.getElementById('loading-state');
const taskCounter = document.getElementById('task-counter');
const toast = document.getElementById('toast');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

// ============================
// API Helpers
// ============================

async function apiRequest(url, options = {}) {
    try {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Something went wrong');
        }
        return await res.json();
    } catch (err) {
        if (err.name === 'TypeError') {
            throw new Error('Unable to connect to server');
        }
        throw err;
    }
}

async function fetchTasks() {
    return apiRequest(API_URL);
}

async function createTask(title) {
    return apiRequest(API_URL, {
        method: 'POST',
        body: JSON.stringify({ title }),
    });
}

async function updateTask(id, data) {
    return apiRequest(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function deleteTask(id) {
    return apiRequest(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
}

// ============================
// Toast Notifications
// ============================

let toastTimeout;
function showToast(message, type = 'info') {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = 'toast show toast-' + type;
    toastTimeout = setTimeout(() => {
        toast.className = 'toast';
    }, 2800);
}

// ============================
// Render Tasks
// ============================

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter((t) => !t.completed);
        case 'completed':
            return tasks.filter((t) => t.completed);
        default:
            return tasks;
    }
}

function updateCounter() {
    const activeCount = tasks.filter((t) => !t.completed).length;
    taskCounter.textContent =
        activeCount === 1 ? '1 task left' : `${activeCount} tasks left`;
}

function renderTasks() {
    const filtered = getFilteredTasks();
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    if (filtered.length === 0 && tasks.length > 0) {
        const noResult = document.createElement('li');
        noResult.className = 'empty-state';
        noResult.style.display = 'block';
        noResult.innerHTML = `
      <div class="empty-icon">🔍</div>
      <p class="empty-title">No ${currentFilter} tasks</p>
      <p class="empty-subtitle">Try a different filter</p>
    `;
        taskList.appendChild(noResult);
    }

    filtered.forEach((task) => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });

    updateCounter();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task._id;

    li.innerHTML = `
    <label class="task-checkbox">
      <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}" />
      <span class="checkmark"></span>
    </label>
    <span class="task-title">${escapeHtml(task.title)}</span>
    <div class="task-actions">
      <button class="btn-icon btn-edit" aria-label="Edit task" title="Edit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="btn-icon btn-delete" aria-label="Delete task" title="Delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `;

    // Toggle complete
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => handleToggle(task._id, checkbox.checked));

    // Edit
    const editBtn = li.querySelector('.btn-edit');
    editBtn.addEventListener('click', () => handleEdit(li, task));

    // Delete
    const deleteBtn = li.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => handleDelete(task._id, li));

    return li;
}

// ============================
// Event Handlers
// ============================

// Add task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const newTask = await createTask(title);
        tasks.unshift(newTask);
        taskInput.value = '';
        renderTasks();
        showToast('Task added! ✨', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// Toggle complete
async function handleToggle(id, completed) {
    try {
        const updated = await updateTask(id, { completed });
        const idx = tasks.findIndex((t) => t._id === id);
        if (idx !== -1) tasks[idx] = updated;
        renderTasks();
        showToast(completed ? 'Task completed! 🎉' : 'Task reopened', 'success');
    } catch (err) {
        showToast(err.message, 'error');
        renderTasks(); // re-render to revert checkbox
    }
}

// Edit task
function handleEdit(li, task) {
    const titleSpan = li.querySelector('.task-title');
    const actionsDiv = li.querySelector('.task-actions');

    // Replace title with input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.title;
    input.maxLength = 200;
    titleSpan.replaceWith(input);
    input.focus();
    input.select();

    // Replace actions with save button
    actionsDiv.innerHTML = `
    <button class="btn-icon btn-save" aria-label="Save task" title="Save">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>
  `;

    const saveEdit = async () => {
        const newTitle = input.value.trim();
        if (!newTitle) {
            showToast('Title cannot be empty', 'error');
            return;
        }
        if (newTitle === task.title) {
            renderTasks();
            return;
        }
        try {
            const updated = await updateTask(task._id, { title: newTitle });
            const idx = tasks.findIndex((t) => t._id === task._id);
            if (idx !== -1) tasks[idx] = updated;
            renderTasks();
            showToast('Task updated! ✏️', 'success');
        } catch (err) {
            showToast(err.message, 'error');
            renderTasks();
        }
    };

    actionsDiv.querySelector('.btn-save').addEventListener('click', saveEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') renderTasks();
    });
}

// Delete task
async function handleDelete(id, li) {
    li.classList.add('removing');
    try {
        await deleteTask(id);
        tasks = tasks.filter((t) => t._id !== id);
        setTimeout(() => renderTasks(), 300);
        showToast('Task deleted 🗑️', 'info');
    } catch (err) {
        li.classList.remove('removing');
        showToast(err.message, 'error');
    }
}

// Filter buttons
filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// ============================
// Utility
// ============================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================
// Initialize
// ============================

async function init() {
    loadingState.classList.add('show');
    try {
        tasks = await fetchTasks();
        loadingState.classList.remove('show');
        renderTasks();
    } catch (err) {
        loadingState.classList.remove('show');
        showToast('Failed to load tasks: ' + err.message, 'error');
        emptyState.style.display = 'block';
    }
}

init();
