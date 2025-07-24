// format time
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function convertTo24(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
  const checkbox = document.querySelector('.checkbox');
  const activeTasksBtn = document.querySelector('.active-task');
  const completedTasksBtn = document.querySelector('.completed-task');

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

  function addTask() {
    clearForm();
    openEditor("Add Task");
  }

  function editTask(taskElement, taskData) {
    currentTaskElement = taskElement;
    editMode = true;
  
    taskTitle.value = taskData.title;
    taskDescription.value = taskData.description;
    startTime.value = convertTo24(taskData.start);
    endTime.value = convertTo24(taskData.end);
  
    openEditor("Edit Task");
  }

  function deleteTask() {
    const checkedBoxes = document.querySelectorAll('.task .checkbox:checked');
  
    checkedBoxes.forEach(cb => {
      const taskEl = cb.closest('.task');
      const taskId = taskEl.dataset.id;
  
      // Remove from activeTasks
      const taskIndex = activeTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        activeTasks.splice(taskIndex, 1);
      }
  
      // Remove from DOM
      taskEl.remove();
    });
  
    toggleButtons(); // Disable buttons again if no tasks are selected
  }

  function saveTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const start = startTime.value;
    const end = endTime.value;
  
    // Clear previous error messages
    clearErrorMessages();
  
    // 1. Validate empty fields
    if (!title || !description) {
      if (!title) {
        showError('title-error', 'Task title is required');
      }
      if (!description) {
        showError('description-error', 'Task description is required');
      }
      return;
    }
  
    // 2. Validate time logic
    if (!start || !end) {
      showError('time-error', 'Start time and end time are required');
      return;
    }
  
    if (start >= end) {
      showError('time-error', 'End time must be later than start time');
      return;
    }
  
    // 3. Continue if valid
    const formattedStart = formatTime(start);
    const formattedEnd = formatTime(end);
  
    if (editMode && currentTaskElement) {
      // Editing existing task
      const taskId = currentTaskElement.dataset.id;
      const task = activeTasks.find(t => t.id === taskId);
      if (!task) return;
  
      task.title = title;
      task.description = description;
      task.start = formattedStart;
      task.end = formattedEnd;
  
      currentTaskElement.querySelector('.title span').textContent = title;
      currentTaskElement.querySelector('.description p').textContent = description;
      currentTaskElement.querySelector('.time p').textContent = `🕐 ${formattedStart} - ${formattedEnd}`;
    } else {
      // Creating new task
      const task = createTaskObject(title, description, formattedStart, formattedEnd);
      const wrapper = document.createElement('div');
      wrapper.innerHTML = formatTaskHTML(task);
      const taskElement = wrapper.firstElementChild;
  
      main.appendChild(taskElement);
      activeTasks.push(task);
    }
  
    closeEditor();

    console.log(activeTasks);
  }

  function completeTask() {
    const checkedBoxes = document.querySelectorAll('.task .checkbox:checked');

    checkedBoxes.forEach(cb => {
      const taskEl = cb.closest('.task');
      const taskId = taskEl.dataset.id;

      // Find index in activeTasks
      const taskIndex = activeTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        // Remove from activeTasks and mark completed
        const [task] = activeTasks.splice(taskIndex, 1);
        task.completed = true;

        // Add to completedTasks
        completedTasks.push(task);

        // Update DOM
        taskEl.classList.add('completed');
        cb.disabled = true;
        const editBtn = taskEl.querySelector('.edit-task');
        if (editBtn) editBtn.disabled = true;
      }
    });

    toggleButtons(); // Re-disable buttons after action
  }

  function openEditor(title) {
    popup.style.display = 'flex';
    popup.querySelector('.popup-title').textContent = title;
    clearErrorMessages();
  }

  function closeEditor() {
    popup.style.display = 'none';
    clearForm();
    editMode = false;
    currentTaskElement = null;
  }

  function clearForm() {
    taskTitle.value = '';
    taskDescription.value = '';
    startTime.value = '';
    endTime.value = '';
    clearErrorMessages();
  }

  function showError(errorClass, message) {
    const errorElement = document.querySelector(`.${errorClass}`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.style.display = 'none';
    });
  }

  function toggleButtons() {
    // Only consider visible tasks (not hidden by page switching)
    const checkboxes = document.querySelectorAll('.task:not([style*="display: none"]) .checkbox');
    const isAnyChecked = [...checkboxes].some(cb => cb.checked);

    if (isAnyChecked) {
      checkBtn.disabled = false;
      deleteBtn.disabled = false;
      checkBtn.style.opacity = 1;
      deleteBtn.style.opacity = 1;
      checkBtn.style.cursor = 'pointer';
      deleteBtn.style.cursor = 'pointer';
    } else {
      checkBtn.disabled = true;
      deleteBtn.disabled = true;
      checkBtn.style.opacity = 0.5;
      deleteBtn.style.opacity = 0.5;
      checkBtn.style.cursor = 'default';
      deleteBtn.style.cursor = 'default';
    }
  }

  function activeTasksPage() {
    // Show active tasks, hide completed tasks
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
      if (!task.classList.contains('completed')) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
    
    // Update button styles to show active page is selected
    activeTasksBtn.style.background = 'linear-gradient(135deg, #3730a3, #5b21b6)';
    activeTasksBtn.style.transform = 'scale(1.05)';
    completedTasksBtn.style.background = 'linear-gradient(135deg, #059669, #0d9488)';
    completedTasksBtn.style.transform = 'scale(1)';
    
    // Enable/disable operation buttons based on visible tasks
    toggleButtons();
  }

  function completedTasksPage() {
    // Show completed tasks, hide active tasks
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
      if (task.classList.contains('completed')) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
    
    // Update button styles to show completed page is selected
    completedTasksBtn.style.background = 'linear-gradient(135deg, #047857, #0f766e)';
    completedTasksBtn.style.transform = 'scale(1.05)';
    activeTasksBtn.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
    activeTasksBtn.style.transform = 'scale(1)';
    
    // Disable operation buttons since completed tasks can't be edited
    checkBtn.disabled = true;
    deleteBtn.disabled = true;
    checkBtn.style.opacity = 0.5;
    deleteBtn.style.opacity = 0.5;
    checkBtn.style.cursor = 'default';
    deleteBtn.style.cursor = 'default';
  }

  // add event listeners
  addBtn.addEventListener('click', addTask);
  deleteBtn.addEventListener('click', deleteTask);
  checkBtn.addEventListener('click', completeTask);
  cancelBtn.addEventListener('click', closeEditor);
  saveBtn.addEventListener('click', saveTask);
  // Handles clicks (like editing)
  main.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-task')) {
      const taskEl = e.target.closest('.task');
      const taskId = taskEl.dataset.id;
      const taskData = activeTasks.find(t => t.id === taskId);
      editTask(taskEl, taskData);
    }
  });

  // Handles checkbox changes
  main.addEventListener('change', (e) => {
    if (e.target.classList.contains('checkbox')) {
      toggleButtons();
    }
  });

  // Clear error messages when user starts typing
  taskTitle.addEventListener('input', () => {
    const titleError = document.querySelector('.title-error');
    if (titleError) titleError.style.display = 'none';
  });

  taskDescription.addEventListener('input', () => {
    const descriptionError = document.querySelector('.description-error');
    if (descriptionError) descriptionError.style.display = 'none';
  });

  startTime.addEventListener('change', () => {
    const timeError = document.querySelector('.time-error');
    if (timeError) timeError.style.display = 'none';
  });

  endTime.addEventListener('change', () => {
    const timeError = document.querySelector('.time-error');
    if (timeError) timeError.style.display = 'none';
  });

  activeTasksBtn.addEventListener('click', activeTasksPage);
  completedTasksBtn.addEventListener('click', completedTasksPage);
  
  // Initialize the page to show active tasks by default
  activeTasksPage();
});