/**
 * breadcrumb.js — Bloque AEM EDS: Breadcrumb
 * Navegación secundaria de ubicación en la jerarquía del sitio con variantes de fondo negro y transparente
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {} — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque breadcrumb añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;
  // CSS: .breadcrumb .breadcrumbsimple ul > li con clases .primero / .ultimo
  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const wrapper = document.createElement('div');
  wrapper.className = 'breadcrumbsimple';

  const ul = document.createElement('ul');
  ul.setAttribute('role', 'list');

  // Cada celda es un item del breadcrumb
  const items = [];
  rows.forEach(row => {
    [...row.querySelectorAll(':scope > div')].forEach(cell => {
      const text = cell.textContent.trim();
      const link = cell.querySelector('a');
      if (text) items.push({ text, href: link?.href || null });
    });
  });

  items.forEach(({ text, href }, i) => {
    const li = document.createElement('li');
    if (i === 0) li.classList.add('primero');
    if (i === items.length - 1) li.classList.add('ultimo', 'current');

    if (href && i < items.length - 1) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      li.appendChild(a);
    } else {
      li.setAttribute('aria-current', 'page');
      li.textContent = text;
    }
    ul.appendChild(li);
  });

  wrapper.appendChild(ul);
  nav.appendChild(wrapper);
  block.appendChild(nav);
  block.classList.add('breadcrumb--initialized');
}
