const checkboxes = document.querySelectorAll('.checkbox');
const checkBtn = document.querySelector('.check-task');
const deleteBtn = document.querySelector('.delete-task');

function toggle(btn, checkboxes) {
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

      if (anyChecked) {
        btn.style.opacity = 1;
        btn.style.pointerEvents = 'auto';
      } else {
        btn.style.opacity = 0.5;
        btn.style.pointerEvents = 'none';
      }
    });
  });
}

toggle(checkBtn, checkboxes);
toggle(deleteBtn, checkboxes);