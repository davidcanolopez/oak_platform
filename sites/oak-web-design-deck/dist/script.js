const slides = [...document.querySelectorAll('.slide')];
const dots = document.querySelector('#dots');
const current = document.querySelector('#current');
const total = document.querySelector('#total');
const chapter = document.querySelector('#chapter');
const progress = document.querySelector('#progress');
const bar = document.querySelector('.deck-bar');

let activeIndex = 0;
total.textContent = String(slides.length).padStart(2, '0');

slides.forEach((slide, index) => {
  const dot = document.createElement('a');
  dot.href = `#${slide.id}`;
  dot.setAttribute('aria-label', `${String(index + 1).padStart(2, '0')} · ${slide.dataset.label}`);
  dots.appendChild(dot);
});

const dotLinks = [...dots.querySelectorAll('a')];

function activate(index) {
  activeIndex = Math.max(0, Math.min(slides.length - 1, index));
  const slide = slides[activeIndex];
  current.textContent = String(activeIndex + 1).padStart(2, '0');
  chapter.textContent = slide.dataset.label || 'Web experience';
  progress.style.transform = `scaleY(${(activeIndex + 1) / slides.length})`;
  bar.dataset.theme = slide.dataset.theme || 'dark';
  dotLinks.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  slide.querySelectorAll('.reveal').forEach((item, i) => {
    window.setTimeout(() => item.classList.add('visible'), 90 + i * 95);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) activate(slides.indexOf(entry.target));
  });
}, { threshold: 0.55 });

slides.forEach(slide => observer.observe(slide));

function goTo(index) {
  slides[Math.max(0, Math.min(slides.length - 1, index))].scrollIntoView({ behavior: 'smooth' });
}

document.querySelector('#prev').addEventListener('click', () => goTo(activeIndex - 1));
document.querySelector('#next').addEventListener('click', () => goTo(activeIndex + 1));

document.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goTo(activeIndex + 1);
  }
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goTo(activeIndex - 1);
  }
  if (event.key === 'Home') goTo(0);
  if (event.key === 'End') goTo(slides.length - 1);
});

document.querySelectorAll('form, .signup-window, .phone').forEach(scope => {
  scope.addEventListener('submit', event => event.preventDefault());
});

activate(0);

if (window.location.hash) {
  const hashIndex = slides.findIndex(slide => `#${slide.id}` === window.location.hash);
  if (hashIndex >= 0) window.requestAnimationFrame(() => activate(hashIndex));
}
