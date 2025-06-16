import { createTask, formatTaskHTML, getTaskFromElement, formatTime } from './taskManager.js';
import { showActiveTasks, showCompletedTasks, bindCheckboxToggles, clearForm, openEditor, closeEditor } from './uiManager.js';
import { saveTasksToStorage, loadTasksFromStorage, renderSavedTasks } from './storageManager.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Data storage for tasks
  let activeTasks = [];
  let completedTasks = [];
  const MAX_COMPLETED_TASKS = 9;

  // Load saved tasks from localStorage
  const savedActiveTasks = localStorage.getItem('activeTasks');
  const savedCompletedTasks = localStorage.getItem('completedTasks');
  if (savedActiveTasks) activeTasks = JSON.parse(savedActiveTasks);
  if (savedCompletedTasks) completedTasks = JSON.parse(savedCompletedTasks);

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
    console.log('Creating task:', { title, description, start, end });
    return { title, description, start, end, completed: false };
  }

  function showActiveTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
      if (!task.classList.contains('completed')) {
        task.style.display = 'flex';
      } else {
        task.style.display = 'none';
      }
    });
    
    // Update button styles
    document.querySelector('.active-task').style.opacity = '1';
    document.querySelector('.completed-task').style.opacity = '0.5';
  }

  function showCompletedTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
      if (task.classList.contains('completed')) {
        task.style.display = 'flex';
      } else {
        task.style.display = 'none';
      }
    });
    
    // Update button styles
    document.querySelector('.active-task').style.opacity = '0.5';
    document.querySelector('.completed-task').style.opacity = '1';
  }

  function deleteSelectedTasks() {
    const checkboxes = document.querySelectorAll('.checkbox:checked');
    checkboxes.forEach(checkbox => {
      const taskElement = checkbox.closest('.task');
      if (taskElement) {
        const taskTitle = taskElement.querySelector('.title span').innerText;
        
        // Remove from appropriate array
        if (taskElement.classList.contains('completed')) {
          completedTasks = completedTasks.filter(t => t.title !== taskTitle);
        } else {
          activeTasks = activeTasks.filter(t => t.title !== taskTitle);
        }

        // Add fade-out animation
        taskElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'scale(0.95)';
        
        // Remove the element after animation
        setTimeout(() => {
          taskElement.remove();
          bindCheckboxToggles();
          saveTasksToStorage();
        }, 300);
      }
    });
  }

  function completeSelectedTasks() {
    const checkboxes = document.querySelectorAll('.checkbox:checked');
    
    checkboxes.forEach(checkbox => {
      const taskElement = checkbox.closest('.task');
      if (taskElement) {
        const taskTitle = taskElement.querySelector('.title span').innerText;
        const taskIndex = activeTasks.findIndex(t => t.title === taskTitle);
        
        if (taskIndex !== -1) {
          // Get the task and remove it from active tasks
          const completedTask = activeTasks.splice(taskIndex, 1)[0];
          completedTask.completed = true;

          // Add to completed tasks (at the beginning)
          completedTasks.unshift(completedTask);

          // If we have more than 9 completed tasks, remove the oldest one
          if (completedTasks.length > MAX_COMPLETED_TASKS) {
            completedTasks.pop(); // Remove the last (oldest) task
          }

          // Update the task element
          taskElement.classList.add('completed');
          
          // If we're in active tasks view, hide the completed task
          if (document.querySelector('.active-task').style.opacity === '1') {
            taskElement.style.display = 'none';
          }

          // Disable the checkbox and edit button
          checkbox.disabled = true;
          taskElement.querySelector('.edit-task').disabled = true;

          // Uncheck the checkbox
          checkbox.checked = false;
        }
      }
    });
    
    // Update button states and save to localStorage
    bindCheckboxToggles();
    saveTasksToStorage();
  }

  function formatTaskHTML(task) {
    return `
      <div class="task ${task.completed ? 'completed' : ''}">
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
    // Check if we're at the limit for active tasks
    if (activeTasks.length >= 15) {
      // Show error message in the website
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.display = 'block';
      errorDiv.style.color = '#dc2626';
      errorDiv.style.textAlign = 'center';
      errorDiv.style.marginTop = '10px';
      errorDiv.style.position = 'fixed';
      errorDiv.style.top = '20px';
      errorDiv.style.left = '50%';
      errorDiv.style.transform = 'translateX(-50%)';
      errorDiv.style.backgroundColor = 'white';
      errorDiv.style.padding = '10px 20px';
      errorDiv.style.borderRadius = '5px';
      errorDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      errorDiv.style.zIndex = '1000';
      errorDiv.textContent = 'Maximum limit of 15 active tasks reached!';
      
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        errorDiv.remove();
      }, 3000);
      
      return;
    }

    activeTasks.push(task);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = formatTaskHTML(task);
    const taskElement = wrapper.firstElementChild;

    taskElement.querySelector('.edit-task').addEventListener('click', () => {
      const result = openEditor("Edit Task", taskElement);
      editMode = result.editMode;
      currentTaskElement = result.currentTaskElement;
    });

    main.appendChild(taskElement);
    
    if (document.querySelector('.completed-task').style.opacity === '1') {
      taskElement.style.display = 'none';
    }

    bindCheckboxToggles();
    saveTasksToStorage();
  }

  function updateTask(taskEl, updatedTask) {
    const taskTitle = taskEl.querySelector('.title span').innerText;
    const isCompleted = taskEl.classList.contains('completed');
    
    // Update the task in the appropriate array
    if (isCompleted) {
      const index = completedTasks.findIndex(t => t.title === taskTitle);
      if (index !== -1) {
        completedTasks[index] = updatedTask;
      }
    } else {
      const index = activeTasks.findIndex(t => t.title === taskTitle);
      if (index !== -1) {
        activeTasks[index] = updatedTask;
      }
    }

    taskEl.querySelector('.title span').innerText = updatedTask.title;
    taskEl.querySelector('.description p').innerText = updatedTask.description;
    taskEl.querySelector('.time p').innerText = `🕐 ${updatedTask.start} - ${updatedTask.end}`;
    
    bindCheckboxToggles();
    saveTasksToStorage();
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
    const title = titleEl.value.trim();
    const description = descriptionEl.value.trim();
    const startTime = startEl.value;
    const endTime = endEl.value;
    
    console.log('Saving task with values:', { title, description, startTime, endTime });
    
    // Get all error message elements
    const timeError = document.querySelector('.form-group:last-child .error-message');
    const titleError = document.querySelector('.title-error');
    const descriptionError = document.querySelector('.description-error');
    
    // Reset all error messages
    timeError.style.display = 'none';
    titleError.style.display = 'none';
    descriptionError.style.display = 'none';
    
    // Validate required fields
    let hasError = false;
    
    if (!title) {
      titleError.style.display = 'block';
      hasError = true;
    }
    
    if (!description) {
      descriptionError.style.display = 'block';
      hasError = true;
    }

    // Convert times to comparable values (minutes since midnight)
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Validate time
    if (startTotalMinutes >= endTotalMinutes) {
      timeError.style.display = 'block';
      hasError = true;
    }

    // If there are any errors, don't save
    if (hasError) {
      console.log('Validation errors found, not saving task');
      return;
    }

    const start = formatTime(startTime);
    const end = formatTime(endTime);

    const task = createTask(title, description, start, end);
    console.log('Created task object:', task);

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
    const checkboxes = document.querySelectorAll('.checkbox:not([disabled])');

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

  addTaskBtn.addEventListener('click', () => {
    // Check if we're at the limit for active tasks
    const activeTasks = document.querySelectorAll('.task').length;
    if (activeTasks >= 15) {
      // Show error message in the website
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.display = 'block';
      errorDiv.style.color = '#dc2626';
      errorDiv.style.textAlign = 'center';
      errorDiv.style.marginTop = '10px';
      errorDiv.style.position = 'fixed';
      errorDiv.style.top = '20px';
      errorDiv.style.left = '50%';
      errorDiv.style.transform = 'translateX(-50%)';
      errorDiv.style.backgroundColor = 'white';
      errorDiv.style.padding = '10px 20px';
      errorDiv.style.borderRadius = '5px';
      errorDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      errorDiv.style.zIndex = '1000';
      errorDiv.textContent = 'Maximum limit of 15 active tasks reached!';
      
      // Add error message to body
      document.body.appendChild(errorDiv);
      
      // Remove error message after 3 seconds
      setTimeout(() => {
        errorDiv.remove();
      }, 3000);
      
      return;
    }

    const result = openEditor("Add Task");
    editMode = result.editMode;
    currentTaskElement = result.currentTaskElement;
  });
  cancelBtn.addEventListener('click', closeEditor);
  saveBtn.addEventListener('click', saveTask);
  deleteBtn.addEventListener('click', deleteSelectedTasks);
  checkBtn.addEventListener('click', completeSelectedTasks);
  
  // Add event listeners for status buttons
  document.querySelector('.active-task').addEventListener('click', showActiveTasks);
  document.querySelector('.completed-task').addEventListener('click', showCompletedTasks);

  // Initialize checkbox toggles and show active tasks by default
  bindCheckboxToggles();
  showActiveTasks();

  // Render saved tasks
  renderSavedTasks(activeTasks.concat(completedTasks), main);

  // Initial render of tasks
  function renderTasks() {
    // Clear main container
    main.innerHTML = '';

    // Render active tasks
    activeTasks.forEach(task => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = formatTaskHTML(task);
      const taskElement = wrapper.firstElementChild;
      
      taskElement.querySelector('.edit-task').addEventListener('click', () => {
        const result = openEditor("Edit Task", taskElement);
        editMode = result.editMode;
        currentTaskElement = result.currentTaskElement;
      });

      main.appendChild(taskElement);
    });

    // Render only the 9 most recent completed tasks
    const recentCompletedTasks = completedTasks.slice(0, 9);
    recentCompletedTasks.forEach(task => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = formatTaskHTML(task);
      const taskElement = wrapper.firstElementChild;
      
      taskElement.classList.add('completed');
      const checkbox = taskElement.querySelector('.checkbox');
      const editButton = taskElement.querySelector('.edit-task');
      if (checkbox) checkbox.disabled = true;
      if (editButton) editButton.disabled = true;

      taskElement.querySelector('.edit-task').addEventListener('click', () => {
        const result = openEditor("Edit Task", taskElement);
        editMode = result.editMode;
        currentTaskElement = result.currentTaskElement;
      });

      main.appendChild(taskElement);
    });

    // Set initial visibility
    showActiveTasks();
  }

  // Initial render
  renderTasks();
});