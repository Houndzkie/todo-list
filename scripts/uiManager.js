import { getTaskFromElement, formatTaskHTML } from './taskManager.js';

// UI management functions
export function showActiveTasks() {
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

export function showCompletedTasks() {
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

export function bindCheckboxToggles() {
  const checkboxes = document.querySelectorAll('.checkbox');
  const checkBtn = document.querySelector('.check-task');
  const deleteBtn = document.querySelector('.delete-task');

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

export function clearForm() {
  document.querySelector('#taskTitle').value = '';
  document.querySelector('#taskDescription').value = '';
  document.querySelector('#start-time').value = '';
  document.querySelector('#end-time').value = '';
}

export function openEditor(title = "Add Task", taskElement = null) {
  const popup = document.querySelector('.popup-container');
  const titleEl = document.querySelector('#taskTitle');
  const descriptionEl = document.querySelector('#taskDescription');
  const startEl = document.querySelector('#start-time');
  const endEl = document.querySelector('#end-time');

  document.querySelector('.popup-title').innerText = title;
  popup.style.display = 'flex';

  if (taskElement) {
    const task = getTaskFromElement(taskElement);
    titleEl.value = task.title;
    descriptionEl.value = task.description;
    startEl.value = task.start;
    endEl.value = task.end;
    return { editMode: true, currentTaskElement: taskElement };
  } else {
    clearForm();
    return { editMode: false, currentTaskElement: null };
  }
}

export function closeEditor() {
  const popup = document.querySelector('.popup-container');
  popup.style.display = 'none';
  clearForm();
} 