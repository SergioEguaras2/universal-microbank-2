/**
 * highlights-carousel.js — Bloque AEM EDS: HighlightsCarousel
 * CSS BEM: .hl-carousel, .hl-carousel__title, .hl-carousel__description,
 *          .hl-carousel__highlights, .hl-carousel__highlights-wrap,
 *          .hl-carousel__highlights-item, .hl-carousel__highlights-item a
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = título, celda 1 = descripción, celda 2 = enlace "Ver más"
 *   Filas 1..N: cada fila = un item del carousel (celda 0 = imagen, celda 1 = título, celda 2 = subtítulo)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [headerRow, ...itemRows] = rows;

  // Cabecera
  if (headerRow) {
    const [titleCell, descCell, linkCell] = [...headerRow.querySelectorAll(':scope > div')];
    const titleWrap = document.createElement('div');
    titleWrap.className = 'hl-carousel__title';

    if (titleCell) {
      const h2 = document.createElement('h2');
      h2.append(...titleCell.childNodes);
      titleWrap.append(h2);
    }
    if (linkCell) {
      const p = document.createElement('p');
      p.append(...linkCell.childNodes);
      titleWrap.append(p);
    }

    if (descCell) {
      const descWrap = document.createElement('div');
      descWrap.className = 'hl-carousel__description';
      descWrap.append(...descCell.childNodes);
      block.append(titleWrap, descWrap);
    } else {
      block.append(titleWrap);
    }
    headerRow.remove();
  }

  // Items del carrusel
  const highlights = document.createElement('div');
  highlights.className = 'hl-carousel__highlights';
  const wrap = document.createElement('div');
  wrap.className = 'hl-carousel__highlights-wrap';

  let current = 0;
  const items = [];

  itemRows.forEach((row) => {
    const [imgCell, titleCell, subtitleCell] = [...row.querySelectorAll(':scope > div')];

    const item = document.createElement('div');
    item.className = 'hl-carousel__highlights-item';

    const link = document.createElement('a');
    link.href = imgCell?.querySelector('a')?.href || '#';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'hl-carousel__item-image';
    const img = imgCell?.querySelector('img');
    if (img) imgWrap.append(img.cloneNode(true));
    link.append(imgWrap);

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.className = 'hl-carousel__item-title';
      h3.textContent = titleCell.textContent.trim();
      link.append(h3);
    }
    if (subtitleCell) {
      const sub = document.createElement('p');
      sub.className = 'hl-carousel__item-subtitle';
      sub.textContent = subtitleCell.textContent.trim();
      link.append(sub);
    }

    item.append(link);
    items.push(item);
    wrap.append(item);
    row.remove();
  });

  highlights.append(wrap);

  // Controles de navegación si hay más de 3 items
  if (items.length > 3) {
    const go = (n) => {
      current = (n + items.length) % items.length;
      wrap.style.transform = `translateX(-${current * (100 / 3)}%)`;
    };

    const prev = document.createElement('button');
    prev.className = 'hl-carousel__btn hl-carousel__btn--prev';
    prev.setAttribute('aria-label', 'Anterior');
    prev.innerHTML = '&#8249;';
    prev.addEventListener('click', () => go(current - 1));

    const next = document.createElement('button');
    next.className = 'hl-carousel__btn hl-carousel__btn--next';
    next.setAttribute('aria-label', 'Siguiente');
    next.innerHTML = '&#8250;';
    next.addEventListener('click', () => go(current + 1));

    highlights.append(prev, next);
  }

  block.append(highlights);
  block.classList.add('highlights-carousel--initialized');
}
