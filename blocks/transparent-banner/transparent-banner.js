/**
 * transparent-banner.js — Bloque AEM EDS: TransparentBanner
 * CSS BEM: .transparent-banner, .transparent-banner__media,
 *          .transparent-banner__image-wrap, .transparent-banner__image-group,
 *          .transparent-banner__text, .transparent-banner__title,
 *          .transparent-banner__carousel, .transparent-banner__carousel-item[.slick-active]
 *
 * Entrada AEM:
 *   Cada fila = un slide. Celda 0 = imagen de fondo, celda 1 = contenido de texto
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  if (rows.length === 0) return;

  const carousel = document.createElement('div');
  carousel.className = 'transparent-banner__carousel';

  const slides = [];

  rows.forEach((row, i) => {
    const [imgCell, textCell] = [...row.querySelectorAll(':scope > div')];

    const slide = document.createElement('div');
    slide.className = 'transparent-banner__carousel-item' + (i === 0 ? ' slick-active' : '');
    slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');

    // Media
    const media = document.createElement('div');
    media.className = 'transparent-banner__media';
    const imgWrap = document.createElement('div');
    imgWrap.className = 'transparent-banner__image-wrap';
    const imgGroup = document.createElement('div');
    imgGroup.className = 'transparent-banner__image-group';
    if (imgCell) imgGroup.append(...imgCell.childNodes);
    imgWrap.append(imgGroup);
    media.append(imgWrap);

    // Texto
    const text = document.createElement('div');
    text.className = 'transparent-banner__text';
    if (textCell) text.append(...textCell.childNodes);

    slide.append(media, text);
    slides.push(slide);
    carousel.append(slide);
    row.remove();
  });

  // Autoplay si hay más de un slide
  if (slides.length > 1) {
    let cur = 0;
    const go = (n) => {
      slides[cur].classList.remove('slick-active');
      slides[cur].setAttribute('aria-hidden', 'true');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('slick-active');
      slides[cur].setAttribute('aria-hidden', 'false');
    };

    // Dots de navegación
    const dotsWrap = document.createElement('ul');
    dotsWrap.className = 'transparent-banner__dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('li');
      dot.className = 'transparent-banner__dot' + (i === 0 ? ' slick-active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        go(i);
        dotsWrap.querySelectorAll('.transparent-banner__dot').forEach((d, j) => d.classList.toggle('slick-active', j === i));
      });
      dotsWrap.append(dot);
    });

    // Prev / Next
    const prev = document.createElement('button');
    prev.className = 'transparent-banner__btn transparent-banner__btn--prev';
    prev.setAttribute('aria-label', 'Anterior');
    prev.innerHTML = '&#8249;';
    prev.addEventListener('click', () => go(cur - 1));

    const next = document.createElement('button');
    next.className = 'transparent-banner__btn transparent-banner__btn--next';
    next.setAttribute('aria-label', 'Siguiente');
    next.innerHTML = '&#8250;';
    next.addEventListener('click', () => go(cur + 1));

    block.append(carousel, prev, next, dotsWrap);
  } else {
    block.append(carousel);
  }

  block.classList.add('transparent-banner--initialized');
}
