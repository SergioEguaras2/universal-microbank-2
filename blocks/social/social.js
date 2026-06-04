/**
 * social.js — Bloque AEM EDS: Social
 * Iconos y enlaces a perfiles en redes sociales
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {} — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque social añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;

  // Añadir clase de inicialización para CSS transitions
  block.classList.add('social--initialized');

  // Implementación genérica — añadir lógica específica del componente
  const items = block.querySelectorAll(':scope > div');
  items.forEach((item, index) => {
    item.classList.add('social__item');
    item.setAttribute('data-index', index);
  });
}
