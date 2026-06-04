/**
 * tabs-banner.js — Bloque AEM EDS: TabsBanner
 * CSS BEM: .tabs-banner__intro, .tabs-banner__title, .tabs-banner__text,
 *          .tabs-banner__carousel, .tabs-banner__content-wrap
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = título, celda 1 = texto intro
 *   Fila 1: celda 0 = labels de tabs (separadas por |), celda 1..N = contenido de cada tab
 *   Filas 2..N: contenido de cada slide del carousel
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  // Fila 0 = intro
  const [introRow, ...carouselRows] = rows;
  const [titleCell, textCell] = [...(introRow?.querySelectorAll(':scope > div') ?? [])];

  const intro = document.createElement('div');
  intro.className = 'tabs-banner__intro';

  if (titleCell) {
    const title = document.createElement('h2');
    title.className = 'tabs-banner__title';
    title.append(...titleCell.childNodes);
    intro.append(title);
  }

  if (textCell) {
    const text = document.createElement('div');
    text.className = 'tabs-banner__text';
    text.append(...textCell.childNodes);
    intro.append(text);
  }

  // Carousel de contenido
  const carousel = document.createElement('div');
  carousel.className = 'tabs-banner__carousel';
  const contentWrap = document.createElement('div');
  contentWrap.className = 'tabs-banner__content-wrap';

  carouselRows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'tabs-banner__slide' + (i === 0 ? ' slick-active' : '');
    slide.append(...row.childNodes);
    contentWrap.append(slide);
    row.remove();
  });

  // Navegación del carousel
  if (carouselRows.length > 1) {
    const dots = document.createElement('ul');
    dots.className = 'tabs-banner__dots';
    carouselRows.forEach((_, i) => {
      const dot = document.createElement('li');
      dot.className = 'tabs-banner__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        contentWrap.querySelectorAll('.tabs-banner__slide').forEach((s, j) => {
          s.classList.toggle('slick-active', j === i);
        });
        dots.querySelectorAll('.tabs-banner__dot').forEach((d, j) => {
          d.classList.toggle('active', j === i);
        });
      });
      dots.append(dot);
    });
    carousel.append(contentWrap, dots);
  } else {
    carousel.append(contentWrap);
  }

  if (introRow) introRow.remove();
  block.append(intro, carousel);
  block.classList.add('tabs-banner--initialized');
}
