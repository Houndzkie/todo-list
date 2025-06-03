const add = document.querySelector('.add-task');

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