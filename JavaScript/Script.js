const header = document.querySelector('header');
const main = document.querySelector('main');

window.addEventListener('scroll', () => {
if (window.scrollY > main.offsetTop) {
  header.classList.add('scrolled');
} else {
  header.classList.remove('scrolled');
}
});

var container = document.querySelector(".hero");
container.style.height = window.innerHeight + "px";