function addTask() {
  let popup = document.querySelector('.add-task');
  let cancel = document.querySelector('.cancel-btn');
  let save = document.querySelector('.save-btn');

  popup.addEventListener('click', () => {
    let showPopup = document.querySelector('.popup-container');
    showPopup.style.display = 'flex';
  })

  cancel.addEventListener('click', () => {
    let hidePopup = document.querySelector('.popup-container');
    hidePopup.style.display = 'none';
  })

  save.addEventListener('click', () => {
    let title = document.querySelector('#taskTitle').value;
    let description = document.querySelector('#taskDescription').value;
    let start = document.querySelector('#start-time').value;
    let end = document.querySelector('#end-time').value;

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
  })
}



addTask();



/*
add.addEventListener('click', () => {
  let main = document.querySelector('main');
  let task = `
        <div class="task">
          <div class="task-operations">
            <div class="input-div">
              <input type="checkbox" class="checkbox">
            </div>
            <div class="title">
              <span>Doing Leetcode and Projects</span>
              <button class="edit-task" title="Edit Task">✏️</button>
            </div>
          </div>
          <div class="description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nunc gravida augue, nec tempor justo ipsum ac ligula.
            </p>
          </div>
          <div class="time">
            <p>🕐 8:00 AM - 4:00 PM</p>
          </div>
        </div>
  `

  main.insertAdjacentHTML('beforeend', task);
});
*/