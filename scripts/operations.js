let edit = false;
let currentTask = null;


function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function showTask(query, str) {
  let popup = document.querySelector(query);

  popup.addEventListener('click', () => {
    let showPopup = document.querySelector('.popup-container');
    showPopup.style.display = 'flex';
    let title = document.querySelector('.popup-title');
    title.innerHTML = str;
  })
}

function cancelTask() {
  let cancel = document.querySelector('.cancel-btn');

  cancel.addEventListener('click', () => {
    let hidePopup = document.querySelector('.popup-container');
    hidePopup.style.display = 'none';
  })
}

function pushTask(title, description, start, end) {
  tasks.push({title, description, start, end});
  console.log(tasks);
}

function saveTask() {
  let save = document.querySelector('.save-btn');

  save.addEventListener('click', () => {
    let title = document.querySelector('#taskTitle').value;
    let description = document.querySelector('#taskDescription').value;
    let start = formatTime(document.querySelector('#start-time').value);
    let end = formatTime(document.querySelector('#end-time').value);

    let main = document.querySelector('main');
    let task = `
          <div class="task">
            <div class="task-operations">
              <div class="input-div">
                <input type="checkbox" class="checkbox">
              </div>
              <div class="title">
                <span>${title}</span>
                <button class="edit-task" title="Edit Task">✏️</button>
              </div>
            </div>
            <div class="description">
              <p>
                ${description}
              </p>
            </div>
            <div class="time">
              <p>🕐 ${start} - ${end}</p>
            </div>
          </div>
      `

      main.insertAdjacentHTML('beforeend', task);

      let hidePopup = document.querySelector('.popup-container');
      hidePopup.style.display = 'none';

      pushTask(title, description, start, end);
  })
}

function saveEditedTask() {
  let save = document.querySelector('.save-btn');

  let title = document.querySelector('#taskTitle').value;
  let description = document.querySelector('#taskDescription').value;
  let start = formatTime(document.querySelector('#start-time').value);
  let end = formatTime(document.querySelector('#end-time').value);



  let hidePopup = document.querySelector('.popup-container');
  hidePopup.style.display = 'none';
}

function addTask() {
  showTask(".add-task", "Add Task");
  saveTask();
  cancelTask();
}

function editTask() {
  showTask(".edit-task", "Edit Task");
  saveEditedTask();
  cancelTask();
}

addTask();
editTask();