document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const alert = document.querySelector('.alert');
    if (alert) alert.style.display = 'none';
  }, 4000);
});