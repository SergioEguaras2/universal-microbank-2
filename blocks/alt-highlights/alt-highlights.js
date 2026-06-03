/**
 * alt-highlights.js — Bloque AEM EDS: AltHighlights
 * CSS BEM: .alt-highlights, .alt-highlights__highlights-wrapper,
 *          .alt-highlights__highlight (li), .alt-highlights__media,
 *          .alt-highlights__content, .alt-highlights__content-wrapper
 *
 * Entrada AEM:
 *   Cada fila = un highlight. Celda 0 = imagen, celda 1 = título+texto+CTA
 *   Filas alternas se muestran invertidas (odd = row-reverse via CSS)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  const ul = document.createElement('ul');
  ul.className = 'alt-highlights__highlights-wrapper';

  rows.forEach((row) => {
    const [imgCell, contentCell] = [...row.querySelectorAll(':scope > div')];

    const li = document.createElement('li');
    li.className = 'alt-highlights__highlight';

    // Media
    const media = document.createElement('div');
    media.className = 'alt-highlights__media';
    if (imgCell) media.append(...imgCell.childNodes);

    // Contenido
    const content = document.createElement('div');
    content.className = 'alt-highlights__content';
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'alt-highlights__content-wrapper';
    if (contentCell) contentWrapper.append(...contentCell.childNodes);
    content.append(contentWrapper);

    li.append(media, content);
    ul.append(li);
    row.remove();
  });

  block.append(ul);
  block.classList.add('alt-highlights--initialized');
}
