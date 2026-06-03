/**
 * aem.js — AEM EDS Core Script
 * Helper functions del boilerplate adaptadas al portal www.microbank.com
 * Generado por SA-D01 del Sprint 2 — Red Agéntica AEM
 */

/**
 * Carga un bloque CSS y JS de forma lazy.
 * Los bloques se cargan en función de la visibilidad en el viewport.
 */
export async function loadBlock(block) {
  const blockName = block.dataset.blockName || block.classList[0];
  const cssPath = `/blocks/${blockName}/${blockName}.css`;
  const jsPath = `/blocks/${blockName}/${blockName}.js`;

  // Cargar CSS del bloque si no está ya cargado
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }

  // Cargar e inicializar el JS del bloque
  try {
    const mod = await import(jsPath);
    if (mod.default) {
      await mod.default(block);
    }
  } catch (err) {
    console.error(`[AEM] Error cargando bloque ${blockName}:`, err);
  }
}

/**
 * Decora todos los bloques detectados en la sección.
 */
export async function decorateBlocks(main) {
  const blocks = main.querySelectorAll('[class]');
  for (const block of blocks) {
    if (block.dataset.blockStatus !== 'loaded') {
      block.dataset.blockStatus = 'loading';
      await loadBlock(block);
      block.dataset.blockStatus = 'loaded';
    }
  }
}

/**
 * Obtiene metadatos de la página desde las meta tags.
 */
export function getMetadata(name) {
  const meta = document.head.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return meta ? meta.content : '';
}

/**
 * Crea un elemento con clase y contenido opcional.
 */
export function createElement(tag, classes = [], ...children) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  children.forEach(child => {
    if (typeof child === 'string') el.textContent = child;
    else el.appendChild(child);
  });
  return el;
}

/**
 * Espera a que el elemento sea visible en el viewport.
 * Útil para carga lazy de bloques secundarios.
 */
export function waitForElement(el) {
  return new Promise(resolve => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(el);
  });
}
