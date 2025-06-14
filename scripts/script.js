// Utility: Converts "14:30" -> "2:30 PM"
function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
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
        // Add fade-out animation
        taskElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'scale(0.95)';
        
        // Remove the element after animation
        setTimeout(() => {
          taskElement.remove();
          // Update button states after deletion
          bindCheckboxToggles();
        }, 300);
      }
    });
  }

  function completeSelectedTasks() {
    const checkboxes = document.querySelectorAll('.checkbox:checked');
    checkboxes.forEach(checkbox => {
      const taskElement = checkbox.closest('.task');
      if (taskElement) {
        taskElement.classList.add('completed');
        
        // Update the task's completed status
        const taskIndex = tasks.findIndex(t => 
          t.title === taskElement.querySelector('.title span').innerText
        );
        if (taskIndex !== -1) {
          tasks[taskIndex].completed = true;
        }

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
    });
    
    // Update button states
    bindCheckboxToggles();
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
    tasks.push(task);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = formatTaskHTML(task);
    const taskElement = wrapper.firstElementChild;

    taskElement.querySelector('.edit-task').addEventListener('click', () => {
      openEditor("Edit Task", taskElement);
    });

    // Add to main and show/hide based on current view
    main.appendChild(taskElement);
    
    // If we're in completed tasks view, hide the new task
    if (document.querySelector('.completed-task').style.opacity === '1') {
      taskElement.style.display = 'none';
    }

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
    const title = titleEl.value.trim();
    const description = descriptionEl.value.trim();
    const startTime = startEl.value;
    const endTime = endEl.value;
    
    // Get all error message elements
    const timeError = document.querySelector('.error-message');
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
      return;
    }

    const start = formatTime(startTime);
    const end = formatTime(endTime);

    const task = createTask(title, description, start, end);

    if (editMode) {
      updateTask(currentTaskElement, task);
    } else {
      addTask(task);
    }

    closeEditor();

    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
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
  deleteBtn.addEventListener('click', deleteSelectedTasks);
  checkBtn.addEventListener('click', completeSelectedTasks);
  
  // Add event listeners for status buttons
  document.querySelector('.active-task').addEventListener('click', showActiveTasks);
  document.querySelector('.completed-task').addEventListener('click', showCompletedTasks);

  // Initialize checkbox toggles and show active tasks by default
  bindCheckboxToggles();
  showActiveTasks();

  // Load saved tasks from localStorage
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    // Render saved tasks
  }
});