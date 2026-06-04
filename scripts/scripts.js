/**
 * scripts.js — Script Principal
 * Se ejecuta inmediatamente al carga del DOM en www.microbank.com
 * Generado por SA-D01 del Sprint 2 — Red Agéntica AEM
 */

import { decorateBlocks, getMetadata } from './aem.js';

/**
 * Punto de entrada principal: decora el contenido de la página.
 */
async function decoratePage() {
  const main = document.querySelector('main');
  if (!main) return;

  // Decorar bloques del main
  await decorateBlocks(main);

  // Añadir clase de tema si está definida en metadatos
  const theme = getMetadata('theme');
  if (theme) document.body.classList.add(`theme-${theme.toLowerCase().replace(/\s+/g, '-')}`);
}

// Iniciar decoración cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
