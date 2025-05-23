const checkboxes = document.querySelectorAll('.checkbox');
const deleteBtn = document.querySelector('.delete-task');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

    if (anyChecked) {
      deleteBtn.style.opacity = 1;
      deleteBtn.style.pointerEvents = 'auto';
    } else {
      deleteBtn.style.opacity = 0.5;
      deleteBtn.style.pointerEvents = 'none';
    }
  });
});