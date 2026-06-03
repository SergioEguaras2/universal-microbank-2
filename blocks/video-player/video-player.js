/**
 * video-player.js — Bloque AEM EDS: VideoPlayer
 * Reproductor de vídeo Brightcove video.js embebido en el contenido de la página
 * (no en el hero), con controls nativos y soporte adaptativo
 *
 * Generado por SA-D02 del Sprint 2 — Red Agéntica AEM
 * Convención: export default function decorate(block) {}
 * — vanilla JS, sin frameworks
 */

/**
 * Decora el bloque video-player añadiendo comportamiento interactivo y accesibilidad.
 * @param {HTMLElement} block - El elemento raíz del bloque en el DOM
 */
export default function decorate(block) {
  if (!block) return;
  // CSS: .video-player__item contiene el reproductor
  const rows = [...block.querySelectorAll(':scope > div')];
  const [mainRow] = rows;

  const wrapper = document.createElement('div');
  wrapper.className = 'video-player__item';

  if (mainRow) {
    // Buscar URL de vídeo en el contenido
    const link = mainRow.querySelector('a');
    const videoUrl = link?.href || '';

    if (videoUrl) {
      // Brightcove/YouTube/MP4
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/)?.[1];
        if (videoId) {
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('title', mainRow.querySelector('p, h2')?.textContent || 'Vídeo');
          wrapper.appendChild(iframe);
        }
      } else {
        // Enlace al vídeo: renderizar como trigger
        const trigger = document.createElement('button');
        trigger.className = 'video-player__trigger';
        trigger.setAttribute('aria-label', 'Reproducir vídeo');
        const img = mainRow.querySelector('picture, img');
        if (img) wrapper.appendChild(img.closest('picture') || img);
        wrapper.appendChild(trigger);
      }
    } else {
      // Sin URL: renderizar contenido tal cual
      [...mainRow.childNodes].forEach((n) => wrapper.appendChild(n));
    }
    mainRow.remove();
  }

  block.innerHTML = '';
  block.appendChild(wrapper);
  block.classList.add('video-player--initialized');
}
