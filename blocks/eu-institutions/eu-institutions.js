/**
 * eu-institutions.js — Bloque AEM EDS: EuInstitutions
 * Banda con logos e iconos de instituciones europeas financiadoras
 * (.eu-institutions-item)
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {}
 * — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque eu-institutions añadiendo
 * comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;
  // CSS: ul.eu-institutions-wrap >
  // li.eu-institutions-item > .eu-institutions-item-link >
  //  .eu-institutions-item-img + p
  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  // Fila 0 — título de la sección
  const [titleRow, ...itemRows] = rows;
  if (titleRow) {
    const heading = titleRow.querySelector('h2, h3') || titleRow;
    const h2 = document.createElement('h2');
    h2.className = 'eu-institutions-title';
    h2.textContent = heading.textContent.trim();
    block.appendChild(h2);
  }

  // Filas restantes — instituciones (imagen | nombre)
  const ul = document.createElement('ul');
  ul.className = 'eu-institutions-wrap'; // Cambiado de eu-institutions__wrap

  itemRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const li = document.createElement('li');
    li.className = 'eu-institutions-item'; // Cambiado de eu-institutions__item

    const link = cells[0]?.querySelector('a');
    const anchor = document.createElement(link ? 'a' : 'div');
    anchor.className = 'eu-institutions-item-link'; // Cambiado de eu-institutions__item-link
    if (link) {
      anchor.href = link.href;
      anchor.target = link.target || '_self';
    }

    const img = cells[0]?.querySelector('img');
    if (img) {
      img.className = 'eu-institutions-item-img'; // Cambiado de eu-institutions__item-img
      img.loading = 'lazy';
      anchor.appendChild(img);
    }

    const name = cells[1]?.textContent.trim() || cells[0]?.textContent.trim();
    if (name && !img) {
      const p = document.createElement('p');
      p.textContent = name;
      anchor.appendChild(p);
    }

    li.appendChild(anchor);
    ul.appendChild(li);
  });

  block.appendChild(ul);
  block.classList.add('eu-institutions-initialized'); // Cambiado de eu-institutions--initialized
}
