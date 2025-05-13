document.querySelectorAll('.menu-item').forEach(button => {
  button.addEventListener('click', () => {
    const link = button.dataset.link;
    if (link) {
      window.location.href = link;
    }
  });
});
