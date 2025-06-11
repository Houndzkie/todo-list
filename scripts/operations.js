// Utility: Converts "14:30" -> "2:30 PM"
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Data storage for all tasks
const tasks = [];

// Cached DOM elements
const main = document.querySelector('main');
const popup = document.querySelector('.popup-container');
const titleEl = document.querySelector('#taskTitle');
const descriptionEl = document.querySelector('#taskDescription');
const startEl = document.querySelector('#start-time');
const endEl = document.querySelector('#end-time');
const saveBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const checkBtn = document.querySelector('.check-task');
const deleteBtn = document.querySelector('.delete-task');
const addTaskBtn = document.querySelector('.add-task');

// Editor state
let editMode = false;
let currentTaskElement = null;

// =============================
// Task Logic
// =============================

function createTask(title, description, start, end) {
  return { title, description, start, end };
}

function formatTaskHTML(task) {
  return `
    <div class="task">
      <div class="task-operations">
        <div class="input-div">
          <input type="checkbox" class="checkbox">
        </div>
        <div class="title">
          <span>${task.title}</span>
          <button class="edit-task" title="Edit Task">✏️</button>
        </div>
      </div>
      <div class="description">
        <p>${task.description}</p>
      </div>
      <div class="time">
        <p>🕐 ${task.start} - ${task.end}</p>
      </div>
    </div>`;
}

function addTask(task) {
  tasks.push(task);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = formatTaskHTML(task);
  const taskElement = wrapper.firstElementChild;

  taskElement.querySelector('.edit-task').addEventListener('click', () => {
    openEditor("Edit Task", taskElement);
  });

  main.appendChild(taskElement);
  bindCheckboxToggles();
}

function updateTask(taskEl, updatedTask) {
  taskEl.querySelector('.title span').innerText = updatedTask.title;
  taskEl.querySelector('.description p').innerText = updatedTask.description;
  taskEl.querySelector('.time p').innerText = `🕐 ${updatedTask.start} - ${updatedTask.end}`;
  bindCheckboxToggles();
}

function getTaskFromElement(el) {
  const title = el.querySelector('.title span').innerText;
  const description = el.querySelector('.description p').innerText;
  const timeText = el.querySelector('.time p').innerText.replace('🕐 ', '');
  const [start, end] = timeText.split(' - ');
  return createTask(title, description, start, end);
}

// =============================
// Popup / Editor Logic
// =============================

function clearForm() {
  titleEl.value = '';
  descriptionEl.value = '';
  startEl.value = '';
  endEl.value = '';
}

function openEditor(title = "Add Task", taskElement = null) {
  document.querySelector('.popup-title').innerText = title;
  popup.style.display = 'flex';

  if (taskElement) {
    editMode = true;
    currentTaskElement = taskElement;
    const task = getTaskFromElement(taskElement);
    titleEl.value = task.title;
    descriptionEl.value = task.description;
    startEl.value = task.start;
    endEl.value = task.end;
  } else {
    editMode = false;
    clearForm();
  }
}

function closeEditor() {
  popup.style.display = 'none';
  clearForm();
}

function saveTask() {
  const title = titleEl.value;
  const description = descriptionEl.value;
  const start = formatTime(startEl.value);
  const end = formatTime(endEl.value);

  const task = createTask(title, description, start, end);

  if (editMode) {
    updateTask(currentTaskElement, task);
  } else {
    addTask(task);
  }

  closeEditor();
}

// =============================
// Checkbox Button Toggle Logic
// =============================

function bindCheckboxToggles() {
  const checkboxes = document.querySelectorAll('.checkbox');

  function toggleButton(btn) {
    function update() {
      const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
      btn.style.opacity = anyChecked ? 1 : 0.5;
      btn.style.pointerEvents = anyChecked ? 'auto' : 'none';
    }

    checkboxes.forEach(cb => {
      cb.removeEventListener('change', update);
      cb.addEventListener('change', update);
    });

    update();
  }

  toggleButton(checkBtn);
  toggleButton(deleteBtn);
}

// =============================
// Event Binding (Startup)
// =============================

addTaskBtn.addEventListener('click', () => openEditor("Add Task"));
cancelBtn.addEventListener('click', closeEditor);
saveBtn.addEventListener('click', saveTask);

// You can now use addTask(createTask(...)) to populate tasks if needed.










/*
// Utility: Converts "14:30" -> "2:30 PM"
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Task class to store task data
class Task {
  constructor(title, description, start, end) {
    this.title = title;
    this.description = description;
    this.start = start;
    this.end = end;
  }
}

// TaskEditor manages the popup modal for adding/editing
class TaskEditor {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.editMode = false;
    this.currentTaskElement = null;

    this.saveBtn = document.querySelector('.save-btn');
    this.cancelBtn = document.querySelector('.cancel-btn');
    this.popup = document.querySelector('.popup-container');
    this.titleEl = document.querySelector('#taskTitle');
    this.descriptionEl = document.querySelector('#taskDescription');
    this.startEl = document.querySelector('#start-time');
    this.endEl = document.querySelector('#end-time');

    this.bindEvents();
  }

  bindEvents() {
    this.saveBtn.addEventListener('click', () => this.save());
    this.cancelBtn.addEventListener('click', () => this.close());
  }

  open(title = "Add Task", taskElement = null) {
    document.querySelector('.popup-title').innerText = title;
    this.popup.style.display = 'flex';

    if (taskElement) {
      this.editMode = true;
      this.currentTaskElement = taskElement;

      const task = this.taskManager.getTaskFromElement(taskElement);
      this.titleEl.value = task.title;
      this.descriptionEl.value = task.description;
      this.startEl.value = task.start;
      this.endEl.value = task.end;
    } else {
      this.editMode = false;
      this.clearForm();
    }
  }

  close() {
    this.popup.style.display = 'none';
    this.clearForm();
  }

  clearForm() {
    this.titleEl.value = '';
    this.descriptionEl.value = '';
    this.startEl.value = '';
    this.endEl.value = '';
  }

  save() {
    const title = this.titleEl.value;
    const description = this.descriptionEl.value;
    const start = formatTime(this.startEl.value);
    const end = formatTime(this.endEl.value);

    if (this.editMode) {
      this.taskManager.updateTask(this.currentTaskElement, new Task(title, description, start, end));
    } else {
      this.taskManager.addTask(new Task(title, description, start, end));
    }

    this.close();
  }
}

// TaskManager handles rendering and logic
class TaskManager {
  constructor() {
    this.tasks = [];
    this.main = document.querySelector('main');
    this.editor = new TaskEditor(this);

    // Button references for check and delete
    this.checkBtn = document.querySelector('.check-task');
    this.deleteBtn = document.querySelector('.delete-task');

    // "Add Task" click handler
    document.querySelector('.add-task').addEventListener('click', () => {
      this.editor.open("Add Task");
    });
  }

  formatTaskHTML(task) {
    return `
      <div class="task">
        <div class="task-operations">
          <div class="input-div">
            <input type="checkbox" class="checkbox">
          </div>
          <div class="title">
            <span>${task.title}</span>
            <button class="edit-task" title="Edit Task">✏️</button>
          </div>
        </div>
        <div class="description">
          <p>${task.description}</p>
        </div>
        <div class="time">
          <p>🕐 ${task.start} - ${task.end}</p>
        </div>
      </div>`;
  }

  addTask(task) {
    this.tasks.push(task);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.formatTaskHTML(task);
    const taskElement = wrapper.firstElementChild;

    // Edit button event
    taskElement.querySelector('.edit-task').addEventListener('click', () => {
      this.editor.open("Edit Task", taskElement);
    });

    this.main.appendChild(taskElement);
    this.bindCheckboxToggles(); // Update button state
  }

  getTaskFromElement(el) {
    const title = el.querySelector('.title span').innerText;
    const description = el.querySelector('.description p').innerText;
    const timeText = el.querySelector('.time p').innerText.replace('🕐 ', '');
    const [start, end] = timeText.split(' - ');
    return new Task(title, description, start, end);
  }

  updateTask(el, updatedTask) {
    el.querySelector('.title span').innerText = updatedTask.title;
    el.querySelector('.description p').innerText = updatedTask.description;
    el.querySelector('.time p').innerText = `🕐 ${updatedTask.start} - ${updatedTask.end}`;
    this.bindCheckboxToggles();
  }

  bindCheckboxToggles() {
    const checkboxes = document.querySelectorAll('.checkbox');

    const toggle = (btn) => {
      const update = () => {
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        btn.style.opacity = anyChecked ? 1 : 0.5;
        btn.style.pointerEvents = anyChecked ? 'auto' : 'none';
      };

      checkboxes.forEach(cb => {
        cb.removeEventListener('change', update); // Avoid duplicate listeners
        cb.addEventListener('change', update);
      });

      update(); // Initial state
    };

    toggle(this.checkBtn);
    toggle(this.deleteBtn);
  }
}

// Start everything
const taskManager = new TaskManager();
*/