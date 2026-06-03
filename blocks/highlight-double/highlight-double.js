/**
 * highlight-double.js — Bloque AEM EDS: HighlightDouble
 * CSS BEM: .highlight-double, .highlight-double__item, .highlight-double__image,
 *          .highlight-double__content, .highlight-double__subtitle,
 *          .highlight-double__title, .highlight-double__text
 *
 * Entrada AEM:
 *   Cada fila = un item. Celda 0 = imagen, celda 1 = subtítulo, celda 2 = título, celda 3 = texto
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const [imgCell, subtitleCell, titleCell, textCell] = [...row.querySelectorAll(':scope > div')];

    const item = document.createElement('article');
    item.className = 'highlight-double__item';

    // Imagen
    const imgWrap = document.createElement('div');
    imgWrap.className = 'highlight-double__image';
    if (imgCell) imgWrap.append(...imgCell.childNodes);
    item.append(imgWrap);

    // Contenido superpuesto
    const content = document.createElement('div');
    content.className = 'highlight-double__content';

    if (subtitleCell) {
      const sub = document.createElement('p');
      sub.className = 'highlight-double__subtitle';
      sub.textContent = subtitleCell.textContent.trim();
      content.append(sub);
    }

    if (titleCell) {
      const title = document.createElement('p');
      title.className = 'highlight-double__title';
      title.textContent = titleCell.textContent.trim();
      content.append(title);
    }

    if (textCell) {
      const textWrap = document.createElement('div');
      textWrap.className = 'highlight-double__text';
      textWrap.append(...textCell.childNodes);
      content.append(textWrap);
    }

    item.append(content);
    row.replaceWith(item);
  });

  block.classList.add('highlight-double--initialized');
}
