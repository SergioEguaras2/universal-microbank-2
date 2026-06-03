/**
 * @param {HTMLElement} block El elemento contenedor del bloque en el DOM
 */
export default function decorate(block) {
  // 1. Extraer los datos que el autor ingresó en AEM (o usar los placeholders por defecto)
  const titleText = block.querySelector(':scope > div > div:nth-child(1)')
    ?.textContent?.trim() || 'FINANCIACIÓN CON IMPACTO SOCIAL';
  const subtitleText = block.querySelector(':scope > div > div:nth-child(2)')
    ?.textContent?.trim() || 'PARA TODOS Y EN TODAS PARTES';
  const posterImgSrc = block.querySelector(':scope > div > div:nth-child(3) img')
    ?.src || 'https://www.microbank.com/es/inicio.html/assets/poster-video.jpg';
  const videoSrc = block.querySelector(':scope > div > div:nth-child(4) a')
    ?.href || '#';

  // 2. Limpiar el contenedor para inyectar la estructura semántica optimizada
  block.innerHTML = '';

  // 3. Crear la estructura BEM en kebab-case y añadir atributos para el Universal Editor
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

  // Imagen de fondo con carga diferida (Lighthouse compliant)
  const poster = document.createElement('img');
  poster.className = 'video-banner-poster';
  poster.src = posterImgSrc;
  poster.alt = `Portada de: ${titleText}`;
  poster.loading = 'lazy';
  poster.width = 1280;
  poster.height = 450;

  // Capa de contenidos
  const overlay = document.createElement('div');
  overlay.className = 'video-banner-overlay';

  const title = document.createElement('h2');
  title.className = 'video-banner-title';
  title.setAttribute('data-aue-prop', 'title');
  title.setAttribute('data-aue-type', 'text');
  title.textContent = titleText;

  // Botón con SVG Inline para ahorrar peticiones HTTP
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

  // 4. Armar el árbol del DOM
  overlay.appendChild(title);
  overlay.appendChild(playButton);
  overlay.appendChild(subtitle);

  mediaWrapper.appendChild(poster);
  mediaWrapper.appendChild(overlay);

  container.appendChild(mediaWrapper);
  block.appendChild(container);

  // 5. Evento de interacción (Accesibilidad y Buenas Prácticas)
  playButton.addEventListener('click', () => {
    // Implementar la carga perezosa del reproductor usando videoSrc
    block.dataset.videoUrl = videoSrc;
  });
}
