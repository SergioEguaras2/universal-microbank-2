/**
 * hero-banner.js — Bloque AEM EDS: HeroBanner
 * Carrusel o banner hero en la parte superior con imágenes y texto promocional
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {} — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque hero-banner añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;

  // Añadir clase de inicialización para CSS transitions
  block.classList.add('hero-banner--initialized');

  // Mejorar accesibilidad del hero
  const heading = block.querySelector('h1, h2');
  if (heading && !heading.id) heading.id = 'hero-banner-heading';
  const img = block.querySelector('img');
  if (img && !img.alt) img.alt = '';  // Imagen decorativa si no tiene alt
}
