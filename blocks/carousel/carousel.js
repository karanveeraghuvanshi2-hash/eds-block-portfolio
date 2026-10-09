import { createOptimizedPicture } from '../../scripts/aem.js';

let carouselId = 0;

function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-slide');
  const dots = block.querySelectorAll('.carousel-dot');
  const total = slides.length;
  const next = (index + total) % total;
  slides.forEach((slide, i) => {
    const active = i === next;
    slide.setAttribute('aria-hidden', String(!active));
    slide.toggleAttribute('inert', !active);
  });
  dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === next)));
  block.querySelector('.carousel-track').style.transform = `translateX(-${next * 100}%)`;
  block.dataset.active = String(next);
  block.querySelector('.carousel-status').textContent = `Slide ${next + 1} of ${total}`;
}

function button(className, label, text) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-label', label);
  btn.textContent = text;
  return btn;
}

/**
 * Carousel block. Authoring: one row per slide; column 1 = image, column 2 = text.
 * Accessible (WAI-ARIA carousel pattern), keyboard + swipe support, lazy images.
 */
export default function decorate(block) {
  carouselId += 1;
  const rows = [...block.children];
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', block.dataset.label || 'Featured content');
  block.id = block.id || `carousel-${carouselId}`;

  const track = document.createElement('ul');
  track.className = 'carousel-track';

  rows.forEach((row, i) => {
    const slide = document.createElement('li');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${rows.length}`);
    [...row.children].forEach((col) => {
      col.className = col.querySelector('picture') && col.children.length === 1
        ? 'carousel-slide-image' : 'carousel-slide-content';
      slide.append(col);
    });
    slide.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, i === 0, [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]),
      );
    });
    track.append(slide);
  });

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  viewport.append(track);

  const status = document.createElement('p');
  status.className = 'carousel-status';
  status.setAttribute('aria-live', 'polite');

  block.replaceChildren(viewport, status);
  if (rows.length < 2) {
    showSlide(block, 0);
    return;
  }

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  const prev = button('carousel-prev', 'Previous slide', '‹');
  const next = button('carousel-next', 'Next slide', '›');
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  rows.forEach((_, i) => {
    const dot = button('carousel-dot', `Go to slide ${i + 1}`, '');
    dot.addEventListener('click', () => showSlide(block, i));
    dots.append(dot);
  });
  controls.append(prev, dots, next);
  block.append(controls);

  const current = () => Number(block.dataset.active || 0);
  prev.addEventListener('click', () => showSlide(block, current() - 1));
  next.addEventListener('click', () => showSlide(block, current() + 1));
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showSlide(block, current() - 1);
    if (e.key === 'ArrowRight') showSlide(block, current() + 1);
  });

  let startX = null;
  viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 50) showSlide(block, current() + (delta < 0 ? 1 : -1));
    startX = null;
  });

  showSlide(block, 0);
}
