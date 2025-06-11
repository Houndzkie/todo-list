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

// Utility: Converts "14:30" -> "2:30 PM"
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}


// Start everything
const taskManager = new TaskManager();






/*
function closePopup() {
  let cancel = document.querySelector('.cancel-btn');

  cancel.addEventListener('click', () => {
    let hidePopup = document.querySelector('.popup-container');
    hidePopup.style.display = 'none';
  })
}

function showPopup(mode, taskElement = null) {
  let popupScreen = document.querySelector('.popup-container');
  let popupTitle = document.querySelector('.popup-title');
  let form = document.querySelector('.task-form');

  editMode = mode === 'edit';
  currentTask = taskElement;

  if (editMode) {
    popupTitle.textContent = "Edit Task";
    let title = taskElement.querySelector('#taskTitle').value;
    let description = taskElement.querySelector('#taskDescription').value;
    let start = formatTime(taskElement.querySelector('#start-time').value);
    let end = formatTime(taskElement.querySelector('#end-time').value);

    document.querySelector('#taskTitle').value = title;
    document.querySelector('#taskDescription').value = description;
    document.querySelector('#start-time').value = 'africa';
    document.querySelector('#end-time').value = 'india';
  } else {
    popupTitle.textContent = "Add New Task";

  }

  closePopup();
}
*/