/**
 * search-bar.js — Bloque AEM EDS: SearchBar
 * Campo de búsqueda integrado en la cabecera con panel de presearch desplegable
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {} — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque search-bar añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;
  // El CSS usa .search-bar__item como contenedor del campo de búsqueda.
  const row = block.querySelector(':scope > div');
  if (row) row.classList.add('search-bar__item');

  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.setAttribute('method', 'get');

  const label = document.createElement('label');
  label.setAttribute('for', 'search-bar-input');
  label.className = 'sr-only';
  label.textContent = 'Buscar';

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'search-bar-input';
  input.name = 'q';
  input.placeholder = 'Buscar...';
  input.setAttribute('aria-label', 'Buscar en el sitio');

  const button = document.createElement('button');
  button.type = 'submit';
  button.setAttribute('aria-label', 'Realizar búsqueda');
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  form.append(label, input, button);

  const item = block.querySelector('.search-bar__item') || block;
  item.innerHTML = '';
  item.appendChild(form);

  block.classList.add('search-bar--initialized');
}
