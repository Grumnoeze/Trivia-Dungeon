// Seleccionamos los elementos
const playButton = document.querySelector('.account a');
const lightbox = document.getElementById('lightbox-overlay');
const closeBtn = document.getElementById('close-lightbox');

// Abrir el lightbox
playButton.addEventListener('click', (e) => {
  e.preventDefault(); // Evita que el link redireccione
  lightbox.classList.add('active');
});

// Cerrar el lightbox
closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

// Cerrar al hacer clic fuera del lightbox
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});