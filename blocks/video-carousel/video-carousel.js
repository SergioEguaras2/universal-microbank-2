/**
 * video-carousel.js — Bloque AEM EDS: VideoCarousel
 * CSS BEM: .video-carousel-container, .video-carousel__header, .video-carousel__wrapper,
 *          .video-carousel
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = título, celda 1 = descripción
 *   Filas 1..N: cada fila = un video (celda 0 = embed/iframe/imagen, celda 1 = caption)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [headerRow, ...videoRows] = rows;

  const container = document.createElement('div');
  container.className = 'video-carousel-container';

  // Cabecera
  if (headerRow) {
    const [titleCell, descCell] = [...headerRow.querySelectorAll(':scope > div')];
    const header = document.createElement('div');
    header.className = 'video-carousel__header';

    if (titleCell) {
      const h2 = document.createElement('h2');
      h2.append(...titleCell.childNodes);
      header.append(h2);
    }
    if (descCell) {
      const p = document.createElement('p');
      p.append(...descCell.childNodes);
      header.append(p);
    }
    headerRow.remove();
    container.append(header);
  }

  // Carrusel de vídeos
  const wrapper = document.createElement('div');
  wrapper.className = 'video-carousel__wrapper';
  const track = document.createElement('div');
  track.className = 'video-carousel';

  let current = 0;
  const slides = [];

  videoRows.forEach((row, i) => {
    const [videoCell, captionCell] = [...row.querySelectorAll(':scope > div')];
    const slide = document.createElement('div');
    slide.className = 'video-carousel__slide' + (i === 0 ? ' slick-active' : '');
    slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'video-carousel__media';
    if (videoCell) mediaWrap.append(...videoCell.childNodes);
    slide.append(mediaWrap);

    if (captionCell) {
      const caption = document.createElement('p');
      caption.className = 'video-carousel__caption';
      caption.textContent = captionCell.textContent.trim();
      slide.append(caption);
    }

    slides.push(slide);
    track.append(slide);
    row.remove();
  });

  // Controles de navegación
  if (slides.length > 1) {
    const go = (n) => {
      slides[current].classList.remove('slick-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('slick-active');
      slides[current].setAttribute('aria-hidden', 'false');
    };

    const prev = document.createElement('button');
    prev.className = 'video-carousel__btn video-carousel__btn--prev';
    prev.setAttribute('aria-label', 'Vídeo anterior');
    prev.innerHTML = '&#8249;';
    prev.addEventListener('click', () => go(current - 1));

    const next = document.createElement('button');
    next.className = 'video-carousel__btn video-carousel__btn--next';
    next.setAttribute('aria-label', 'Vídeo siguiente');
    next.innerHTML = '&#8250;';
    next.addEventListener('click', () => go(current + 1));

    wrapper.append(prev, track, next);
  } else {
    wrapper.append(track);
  }

  container.append(wrapper);
  block.append(container);
  block.classList.add('video-carousel--initialized');
}
