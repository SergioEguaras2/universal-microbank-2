/**
 * eu-institutions.js — Bloque AEM EDS: EuInstitutions
 * CSS BEM: .eu-institutions, .eu-institutions-title, .eu-institutions__wrap,
 *          .eu-institutions__item, .eu-institutions__item-link
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = título (h2)
 *   Filas 1..N: cada fila = un item de institución. Celda 0 = enlace, celda 1 = descripción
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  // Fila 0 = título
  const [titleRow, ...itemRows] = rows;
  const titleCell = titleRow?.querySelector(':scope > div');

  const heading = document.createElement('h2');
  heading.className = 'eu-institutions-title';
  heading.textContent = titleCell?.textContent.trim() ?? '';

  const ul = document.createElement('ul');
  ul.className = 'eu-institutions__wrap';

  itemRows.forEach((row) => {
    const [linkCell, descCell] = [...row.querySelectorAll(':scope > div')];

    const li = document.createElement('li');
    li.className = 'eu-institutions__item';

    const linkWrap = document.createElement('div');
    linkWrap.className = 'eu-institutions__item-link';

    // Preservar enlace/imagen que viene de AEM
    if (linkCell) linkWrap.append(...linkCell.childNodes);
    if (descCell) {
      const desc = document.createElement('p');
      desc.textContent = descCell.textContent.trim();
      linkWrap.append(desc);
    }

    li.append(linkWrap);
    ul.append(li);
  });

  rows.forEach(r => r.remove());
  block.append(heading, ul);
  block.classList.add('eu-institutions--initialized');
}
