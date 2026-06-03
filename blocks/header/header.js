/**
 * header.js — Bloque AEM EDS: Header
 * Cabecera global con logo, navegación principal y accesos rápidos
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {} — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque header añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;

  // Añadir clase de inicialización para CSS transitions
  block.classList.add('header--initialized');

  // Añadir comportamiento de navegación responsive
  const nav = block.querySelector('nav, ul');
  if (nav) {
    const toggle = document.createElement('button');
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.add('header__toggle');
    block.prepend(toggle);
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('header__nav--open', !expanded);
    });
  }
}
