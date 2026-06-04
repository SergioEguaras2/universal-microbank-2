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
  videoEl.className = 'video-js';

  placeholder.appendChild(videoEl);
  block.appendChild(placeholder);

  const script = document.createElement('script');
  script.src = `https://players.brightcove.net/${accountId}/${playerId}_default/index.min.js`;
  script.async = true;
  document.head.appendChild(script);
}
  const subtitleText = block.querySelector(':scope > div > div:nth-child(2)')
    ?.textContent?.trim() || 'PARA TODOS Y EN TODAS PARTES';
  const posterImgSrc = block.querySelector(':scope > div > div:nth-child(3) img')
    ?.src || 'https://www.microbank.com/es/inicio.html/assets/poster-video.jpg';

  block.innerHTML = '';

  block.classList.add('video-banner');
  block.setAttribute('data-aue-component', 'video-banner');
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Banner de Vídeo');

  const container = document.createElement('div');
  container.className = 'video-banner-container';

  const mediaWrapper = document.createElement('div');
  mediaWrapper.className = 'video-banner-media-wrapper';
  mediaWrapper.setAttribute('data-aue-prop', 'media');
  mediaWrapper.setAttribute('data-aue-type', 'media');

  const poster = document.createElement('img');
  poster.className = 'video-banner-poster';
  poster.src = posterImgSrc;
  poster.alt = `Portada de: ${titleText}`;
  poster.loading = 'lazy';
  poster.width = 1280;
  poster.height = 450;

  const overlay = document.createElement('div');
  overlay.className = 'video-banner-overlay';

  const title = document.createElement('h2');
  title.className = 'video-banner-title';
  title.setAttribute('data-aue-prop', 'title');
  title.setAttribute('data-aue-type', 'text');
  title.textContent = titleText;

  const playButton = document.createElement('button');
  playButton.className = 'video-banner-play-button';
  playButton.setAttribute('aria-label', `Reproducir vídeo: ${titleText}`);
  playButton.innerHTML = `
    <svg class="video-banner-play-icon" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#00a0e1"/>
      <polygon points="40,30 70,50 40,70" fill="#ffffff"/>
    </svg>
  `;

  const subtitle = document.createElement('p');
  subtitle.className = 'video-banner-subtitle';
  subtitle.setAttribute('data-aue-prop', 'subtitle');
  subtitle.setAttribute('data-aue-type', 'text');
  subtitle.textContent = subtitleText;

  overlay.appendChild(title);
  overlay.appendChild(playButton);
  overlay.appendChild(subtitle);

  mediaWrapper.appendChild(poster);
  mediaWrapper.appendChild(overlay);

  container.appendChild(mediaWrapper);
  block.appendChild(container);

  // Interacción: Carga dinámica y perezosa de Brightcove al hacer Click
  playButton.addEventListener('click', () => {
    // 1. Limpiar los elementos visuales del wrapper (imagen y textos)
    mediaWrapper.innerHTML = '';

    // 2. Crear el elemento de video nativo de Brightcove con tus datos extraídos
    const videoElement = document.createElement('video-js');
    videoElement.setAttribute('data-video-id', '6392232090112');
    videoElement.setAttribute('data-account', '6236382021001');
    videoElement.setAttribute('data-player', 'Jdfh8iZrx5');
    videoElement.setAttribute('data-embed', 'default');
    videoElement.setAttribute('controls', '');
    videoElement.setAttribute('autoplay', '');
    videoElement.className = 'video-banner-player video-js';

    mediaWrapper.appendChild(videoElement);

    // 3. Inyectar el script SDK de Brightcove de manera dinámica para inicializar el reproductor
    const script = document.createElement('script');
    script.src = 'https://players.brightcove.net/6236382021001/Jdfh8iZrx5_default/index.min.js';
    script.async = true;
    script.onload = () => {
      // El SDK de Brightcove detectará automáticamente el tag <video-js> y lo activará
    };
    document.head.appendChild(script);
  });
}
