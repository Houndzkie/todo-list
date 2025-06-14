import { formatTaskHTML } from './taskManager.js';
import { openEditor } from './uiManager.js';

// Storage management functions
export function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadTasksFromStorage() {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : [];
}

export function renderSavedTasks(tasks, main) {
  tasks.forEach(task => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = formatTaskHTML(task);
    const taskElement = wrapper.firstElementChild;

    // Set completed status and visibility
    if (task.completed) {
      taskElement.classList.add('completed');
      const checkbox = taskElement.querySelector('.checkbox');
      const editButton = taskElement.querySelector('.edit-task');
      if (checkbox) checkbox.disabled = true;
      if (editButton) editButton.disabled = true;
    }

    taskElement.querySelector('.edit-task').addEventListener('click', () => {
      openEditor("Edit Task", taskElement);
    });

    main.appendChild(taskElement);
    
    // Set initial visibility based on current view and completed status
    const isCompletedView = document.querySelector('.completed-task').style.opacity === '1';
    if (isCompletedView) {
      taskElement.style.display = task.completed ? 'flex' : 'none';
    } else {
      taskElement.style.display = task.completed ? 'none' : 'flex';
    }
  });
} 