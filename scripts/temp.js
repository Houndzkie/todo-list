// format time
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Data storage for al tasks
  let activeTasks = [];
  let completedTasks = [];

  // HTML elements
  const main = document.querySelector('main');
  const popup = document.querySelector('.popup-container');
  const taskTitle = document.querySelector('#taskTitle');
  const taskDescription = document.querySelector('#taskDescription');
  const startTime = document.querySelector('#start-time');
  const endTime = document.querySelector('#end-time');
  const saveBtn = document.querySelector('.save-btn');
  const cancelBtn = document.querySelector('.cancel-btn');
  const checkBtn = document.querySelector('.check-task');
  const deleteBtn = document.querySelector('.delete-task');
  const addBtn = document.querySelector('.add-task');

  // editor state
  let editMode = false;
  let currentTaskElement = null;

  function createTaskObject(title, description, start, end) {
    return {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title,
      description,
      start,
      end,
      completed: false
    };
  }
  
  function formatTaskHTML(task) {
    return `
      <div class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-operations">
          <div class="input-div">
            <input type="checkbox" class="checkbox" ${task.completed ? 'disabled' : ''}>
          </div>
          <div class="title">
            <span>${task.title}</span>
            <button class="edit-task" title="Edit Task" ${task.completed ? 'disabled' : ''}>✏️</button>
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
    openEditor("Add Task");
  }

  function editTask() {
    openEditor("Edit Task");
  }

  function deleteTask() {

  }

  function saveTask() {


    closeEditor();
  }

  function completeTask() {
    
  }

  function openEditor(title) {
    popup.style.display = 'flex';
    popup.querySelector('.popup-title').textContent = title;
  }

  function closeEditor() {
    popup.style.display = 'none';
    clearForm();
  }

  function clearForm() {
    taskTitle.value = '';
    taskDescription.value = '';
    startTime.value = '';
    endTime.value = '';
  }

  // add event listeners
  addBtn.addEventListener('click', addTask);
  deleteBtn.addEventListener('click', deleteTask);
  checkBtn.addEventListener('click', completeTask);
  saveBtn.addEventListener('click', saveTask);
  cancelBtn.addEventListeter('click', closeEditor);
});