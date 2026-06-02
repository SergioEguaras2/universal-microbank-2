import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slides = [...block.children];
  if (slides.length === 0) return;

  const container = document.createElement('div');
  container.className = 'principal-banner-container-toggle container';

  // Toggle autoplay button
  const togglePlay = document.createElement('button');
  togglePlay.id = 'toggle-play';
  togglePlay.className = 'principal-banner-toggle pause';
  togglePlay.setAttribute('tabindex', '0');
  togglePlay.setAttribute('aria-label', 'Pausar video');
  togglePlay.setAttribute('aria-pressed', 'false');
  togglePlay.innerHTML = `
    <svg role="presentation" xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
      <path d="M1.66667 11.6667C2.58333 11.6667 3.33333 10.9167 3.33333 10V1.66667C3.33333 0.75 2.58333 0 1.66667 0C0.75 0 0 0.75 0 1.66667V10C0 10.9167 0.75 11.6667 1.66667 11.6667ZM6.66667 1.66667V10C6.66667 10.9167 7.41667 11.6667 8.33333 11.6667C9.25 11.6667 10 10.9167 10 10V1.66667C10 0.75 9.25 0 8.33333 0C7.41667 0 6.66667 0.75 6.66667 1.66667Z" fill="white"/>
    </svg>
  `;
  container.append(togglePlay);

  const carousel = document.createElement('div');
  carousel.className = 'principal-banner-carousel';

  const carouselItems = [];

  slides.forEach((row, idx) => {
    const slideItem = document.createElement('div');
    slideItem.className = `principal-banner-carousel-item ${idx === 0 ? 'active' : ''}`;
    moveInstrumentation(row, slideItem);

    // Cells layout:
    // Cell 0: Title
    // Cell 1: Description
    // Cell 2: Link
    // Cell 3: Image
    const cells = [...row.children];

    if (cells.length > 0) {
      const titleVal = cells[0]?.textContent?.trim() || '';
      const descVal = cells[1]?.innerHTML || '';
      const linkVal = cells[2]?.querySelector('a') || cells[2]?.innerHTML || '';
      const imagePic = cells[3]?.querySelector('picture') || cells[3]?.querySelector('img');

      // Create Media / Background Image Wrap
      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'principal-banner-media';

      const imgGroup = document.createElement('div');
      imgGroup.className = 'principal-banner-image-group';

      const mask = document.createElement('div');
      mask.className = 'principal-banner-image-mask';
      imgGroup.append(mask);

      if (imagePic) {
        const img = imagePic.querySelector('img') || imagePic;
        const optimized = createOptimizedPicture(img.src, img.alt || 'Banner background', true);
        optimized.classList.add('original');
        imgGroup.append(optimized);
      }
      mediaWrap.append(imgGroup);
      slideItem.append(mediaWrap);

      // Create Text Container
      const textContainer = document.createElement('div');
      textContainer.className = 'principal-banner-text container';

      const textRow = document.createElement('div');
      textRow.className = 'row';

      const textCol = document.createElement('div');
      textCol.className = 'col';

      if (titleVal) {
        const title = document.createElement('h2');
        title.className = 'principal-banner-title';
        title.textContent = titleVal;
        textCol.append(title);
      }

      if (descVal) {
        const caption = document.createElement('div');
        caption.className = 'principal-banner-caption';
        caption.innerHTML = descVal;
        textCol.append(caption);
      }

      if (linkVal) {
        const ctaWrap = document.createElement('div');
        ctaWrap.className = 'principal-banner-cta';
        if (typeof linkVal === 'string') {
          ctaWrap.innerHTML = linkVal;
        } else {
          ctaWrap.append(linkVal);
        }
        textCol.append(ctaWrap);
      }

      textRow.append(textCol);
      textContainer.append(textRow);
      slideItem.append(textContainer);

      carousel.append(slideItem);
      carouselItems.push(slideItem);
    }
  });

  // Dots navigation
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'principal-banner-dots';
  carouselItems.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `principal-banner-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Ir a la diapositiva ${idx + 1}`);
    dotsContainer.append(dot);
  });
  container.append(dotsContainer);

  block.replaceChildren(container, carousel);

  // Slider interactive logic
  let activeIdx = 0;
  let autoplayInterval = null;
  let isPlaying = true;

  const showSlide = (idx) => {
    carouselItems.forEach((item, i) => {
      if (i === idx) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const dots = dotsContainer.querySelectorAll('.principal-banner-dot');
    dots.forEach((dot, i) => {
      if (i === idx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    activeIdx = idx;
  };

  const nextSlide = () => {
    const nextIdx = (activeIdx + 1) % carouselItems.length;
    showSlide(nextIdx);
  };

  const startAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  // Autoplay control listener
  togglePlay.addEventListener('click', () => {
    if (isPlaying) {
      stopAutoplay();
      togglePlay.className = 'principal-banner-toggle play';
      togglePlay.setAttribute('aria-pressed', 'true');
      togglePlay.setAttribute('aria-label', 'Reproducir video');
      isPlaying = false;
    } else {
      startAutoplay();
      togglePlay.className = 'principal-banner-toggle pause';
      togglePlay.setAttribute('aria-pressed', 'false');
      togglePlay.setAttribute('aria-label', 'Pausar video');
      isPlaying = true;
    }
  });

  // Dots click listener
  dotsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const dots = [...dotsContainer.querySelectorAll('.principal-banner-dot')];
    const clickIdx = dots.indexOf(button);
    if (clickIdx !== -1) {
      showSlide(clickIdx);
      if (isPlaying) startAutoplay(); // Reset timer
    }
  });

  if (isPlaying && carouselItems.length > 1) {
    startAutoplay();
  }
}
