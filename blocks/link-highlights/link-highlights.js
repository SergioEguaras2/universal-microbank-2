/**
 * link-highlights.js — Bloque AEM EDS: LinkHighlights
 * CSS BEM: .link-highlights, .link-highlights__highlights-wrapper,
 *          .link-highlights__highlight[.highlight_height], .link-highlights__image,
 *          .link-highlights__content, .link-highlights__content-wrapper,
 *          .link-highlights__content-nri
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = supratítulo (h1), celda 1 = título (h2), celda 2 = intro (p)
 *   Filas 1..N: celda 0 = imagen, celda 1 = título highlight, celda 2 = texto, celda 3 = enlace
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [headerRow, ...cardRows] = rows;
  const headerCells = [...(headerRow?.querySelectorAll(':scope > div') ?? [])];

  // Cabecera de la sección
  if (headerCells.length >= 2) {
    const [supraCell, titleCell, introCell] = headerCells;

    if (supraCell) {
      const supra = document.createElement('h1');
      supra.textContent = supraCell.textContent.trim();
      block.append(supra);
    }
    if (titleCell) {
      const h2 = document.createElement('h2');
      h2.append(...titleCell.childNodes);
      block.append(h2);
    }
    if (introCell) {
      const p = document.createElement('p');
      p.append(...introCell.childNodes);
      block.append(p);
    }
    headerRow?.remove();
  }

  // Grid de tarjetas
  const wrapper = document.createElement('div');
  wrapper.className = 'link-highlights__highlights-wrapper';

  cardRows.forEach((row) => {
    const [imgCell, titleCell, textCell, linkCell] = [...row.querySelectorAll(':scope > div')];

    const article = document.createElement('article');
    article.className = 'link-highlights__highlight highlight_height';

    if (imgCell) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'link-highlights__image';
      imgWrap.append(...imgCell.childNodes);
      article.append(imgWrap);
    }

    const content = document.createElement('div');
    content.className = 'link-highlights__content';
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'link-highlights__content-wrapper';

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.className = 'link-highlights__content-title';
      h3.append(...titleCell.childNodes);
      contentWrapper.append(h3);
    }
    if (textCell) {
      const p = document.createElement('p');
      p.append(...textCell.childNodes);
      contentWrapper.append(p);
    }
    if (linkCell) {
      const nri = document.createElement('p');
      nri.className = 'link-highlights__content-nri';
      nri.append(...linkCell.childNodes);
      contentWrapper.append(nri);
    }

    content.append(contentWrapper);
    article.append(content);
    wrapper.append(article);
    row.remove();
  });

  block.append(wrapper);
  block.classList.add('link-highlights--initialized');
}
