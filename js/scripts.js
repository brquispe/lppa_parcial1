const navMenu = document.getElementById('nav-menu');
const toggleMenu = document.getElementById('toggle-menu');
const closeMenu = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');
const body = document.getElementsByTagName('body')[0];

toggleMenu.addEventListener('click', () => {
  navMenu.classList.toggle('show')
  overlay.classList.toggle('overlay_show')
  // body.classList.toggle('noscroll');
})

closeMenu.addEventListener('click', () => {
  navMenu.classList.toggle('show')
  overlay.classList.toggle('overlay_show')
  // body.classList.toggle('noscroll');
})