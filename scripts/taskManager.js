// Task creation and management functions
export function createTask(title, description, start, end) {
  console.log('Creating task:', { title, description, start, end });
  return { title, description, start, end, completed: false };
}

export function formatTaskHTML(task) {
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

export function getTaskFromElement(el) {
  const title = el.querySelector('.title span').innerText;
  const description = el.querySelector('.description p').innerText;
  const timeText = el.querySelector('.time p').innerText.replace('🕐 ', '');
  const [start, end] = timeText.split(' - ');
  return createTask(title, description, start, end);
}

export function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
} 