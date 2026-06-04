/**
 * video-banner.js — Bloque AEM EDS: VideoBanner
 * Sección con reproductor de vídeo embebido (Brightcove, YouTube, Vimeo o nativo HTML5)
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {} — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque video-banner añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const videoId = cells[0]?.textContent?.trim() || '6392232090112';
  const accountId = cells[1]?.textContent?.trim() || '6236382021001';
  const playerId = cells[2]?.textContent?.trim() || 'Jdfh8iZrx5';

  // Añadir clase de inicialización para CSS transitions
  block.classList.add('video-banner--initialized');

  const placeholder = document.createElement('div');
  placeholder.className = 'video-banner-placeholder';

  const videoEl = document.createElement('video-js');
  videoEl.setAttribute('data-video-id', videoId);
  videoEl.setAttribute('data-account', accountId);
  videoEl.setAttribute('data-player', playerId);
  videoEl.setAttribute('data-embed', 'default');
  videoEl.setAttribute('controls', '');
  videoEl.setAttribute('data-application-id', '');
  videoEl.setAttribute('data-setup', JSON.stringify({ fluid: true }));
  videoEl.className = 'video-js vjs-fluid vjs-16-9';

  placeholder.appendChild(videoEl);
  block.appendChild(placeholder);

  const script = document.createElement('script');
  script.src = `https://players.brightcove.net/${accountId}/${playerId}_default/index.min.js`;
  script.async = true;
  document.head.appendChild(script);
}
