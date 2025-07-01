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

  // html elements
  const main = document.querySelector('main');
  const popup = document.querySelector('.popup-container');

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
});