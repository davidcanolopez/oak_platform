const slides = [...document.querySelectorAll('.slide')];
const currentSlide = document.getElementById('currentSlide');
const totalSlides = document.getElementById('totalSlides');
const chapter = document.querySelector('.chapter');
const topbar = document.querySelector('.topbar');
const railProgress = document.getElementById('railProgress');
const dotNav = document.getElementById('dotNav');

totalSlides.textContent = String(slides.length).padStart(2, '0');

slides.forEach((slide, index) => {
  const link = document.createElement('a');
  link.href = `#${slide.id}`;
  link.setAttribute('aria-label', `${String(index + 1).padStart(2, '0')} ${slide.dataset.label}`);
  dotNav.appendChild(link);
});

const dots = [...dotNav.querySelectorAll('a')];
let activeIndex = 0;

function setActive(index) {
  activeIndex = Math.max(0, Math.min(slides.length - 1, index));
  const slide = slides[activeIndex];
  currentSlide.textContent = String(activeIndex + 1).padStart(2, '0');
  chapter.textContent = slide.dataset.label || 'Brand identity';
  topbar.dataset.theme = slide.dataset.nav || 'dark';
  dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  railProgress.style.transform = `scaleY(${(activeIndex + 1) / slides.length})`;
}

const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
      setActive(slides.indexOf(entry.target));
    }
  });
}, { threshold: [0.55, 0.75] });

slides.forEach((slide) => slideObserver.observe(slide));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

function goToSlide(index) {
  slides[Math.max(0, Math.min(slides.length - 1, index))].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('prevSlide').addEventListener('click', () => goToSlide(activeIndex - 1));
document.getElementById('nextSlide').addEventListener('click', () => goToSlide(activeIndex + 1));

window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goToSlide(activeIndex + 1);
  }
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goToSlide(activeIndex - 1);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    goToSlide(0);
  }
  if (event.key === 'End') {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }
});

setActive(0);
