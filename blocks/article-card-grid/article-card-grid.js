/**
 * article-card-grid.js — Bloque AEM EDS: ArticleCardGrid
 * CSS BEM: .hl-carousel, .hl-carousel__highlights, .hl-carousel__highlights-wrap,
 *          .hl-carousel__highlights-item, artículo con imagen, categoría y título
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = título sección, celda 1 = enlace "Ver todos"
 *   Filas 1..N: celda 0 = imagen, celda 1 = categoría, celda 2 = título, celda 3 = fecha, celda 4 = enlace
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [headerRow, ...cardRows] = rows;

  // Cabecera de la sección
  if (headerRow) {
    const [titleCell, linkCell] = [...headerRow.querySelectorAll(':scope > div')];
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

    headerRow.replaceWith(titleWrap);
  }

  // Grid de tarjetas
  const highlights = document.createElement('section');
  highlights.className = 'hl-carousel__highlights';
  const wrap = document.createElement('div');
  wrap.className = 'hl-carousel__highlights-wrap';

  cardRows.forEach((row) => {
    const [imgCell, catCell, titleCell, dateCell, linkCell] = [...row.querySelectorAll(':scope > div')];
    const href = linkCell?.querySelector('a')?.href || '#';

    const item = document.createElement('article');
    item.className = 'hl-carousel__highlights-item';

    const a = document.createElement('a');
    a.href = href;
    a.className = 'hl-carousel__highlights-link';

    if (imgCell) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'hl-carousel__highlights-image';
      imgWrap.append(...imgCell.childNodes);
      a.append(imgWrap);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'hl-carousel__highlights-text';

    if (catCell) {
      const cat = document.createElement('span');
      cat.className = 'hl-carousel__highlights-category';
      cat.textContent = catCell.textContent.trim();
      textWrap.append(cat);
    }
    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.className = 'hl-carousel__highlights-title';
      h3.textContent = titleCell.textContent.trim();
      textWrap.append(h3);
    }
    if (dateCell) {
      const date = document.createElement('time');
      date.className = 'hl-carousel__highlights-date';
      date.textContent = dateCell.textContent.trim();
      textWrap.append(date);
    }

    a.append(textWrap);
    item.append(a);
    wrap.append(item);
    row.remove();
  });

  highlights.append(wrap);
  block.append(highlights);
  block.classList.add('article-card-grid--initialized');
}
