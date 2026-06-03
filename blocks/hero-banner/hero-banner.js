/**
 * hero-banner block — carousel/slider
 * @param {HTMLElement} block El elemento contenedor del bloque en el DOM
 */
export default function decorate(block) {
  const rows = [...block.children];

  // ── Build slides ────────────────────────────────────────────────
  const slides = rows.map((row, index) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];

    // Slide wrapper
    const slide = document.createElement('div');
    slide.className = 'hero-banner-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1}`);

    // Background image
    const bg = document.createElement('div');
    bg.className = 'hero-banner-slide-bg';
    bg.setAttribute('data-aue-prop', 'image');
    bg.setAttribute('data-aue-type', 'media');

    const img = imageCell?.querySelector('img');
    if (img) {
      img.setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      img.setAttribute('decoding', 'async');
      img.setAttribute('fetchpriority', index === 0 ? 'high' : 'auto');
      if (!img.alt) img.alt = '';
      bg.append(img);
    }

    // Text content
    const content = document.createElement('div');
    content.className = 'hero-banner-slide-content';

    const textWrap = document.createElement('div');
    textWrap.className = 'hero-banner-slide-text';

    if (textCell) {
      const children = [...textCell.children];

      children.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const text = el.textContent.trim();

        if (!text && !el.querySelector('a')) return;

        // Heading
        if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
          const heading = document.createElement(index === 0 ? 'h1' : 'h2');
          heading.innerHTML = el.innerHTML;
          heading.setAttribute('data-aue-prop', 'heading');
          heading.setAttribute('data-aue-type', 'text');
          textWrap.append(heading);
          return;
        }

        // CTA: paragraph containing only a link
        const links = el.querySelectorAll('a');
        if (tag === 'p' && links.length === 1 && text === links[0].textContent.trim()) {
          const cta = document.createElement('a');
          cta.className = 'hero-banner-cta';
          cta.href = links[0].href;
          cta.textContent = links[0].textContent.trim();
          cta.setAttribute('data-aue-prop', 'cta');
          cta.setAttribute('data-aue-type', 'component');
          textWrap.append(cta);
          return;
        }

        // Eyebrow: first <p> before heading (short, no link)
        if (tag === 'p' && !textWrap.querySelector('h1, h2') && links.length === 0) {
          const eyebrow = document.createElement('p');
          eyebrow.className = 'hero-banner-eyebrow';
          eyebrow.textContent = text;
          eyebrow.setAttribute('data-aue-prop', 'eyebrow');
          eyebrow.setAttribute('data-aue-type', 'text');
          textWrap.append(eyebrow);
          return;
        }

        // Subtitle: remaining <p>
        if (tag === 'p') {
          const subtitle = document.createElement('p');
          subtitle.className = 'hero-banner-subtitle';
          subtitle.innerHTML = el.innerHTML;
          textWrap.append(subtitle);
        }
      });
    }

    content.append(textWrap);
    slide.append(bg, content);
    return slide;
  });

  // ── Clear block & build structure ───────────────────────────────
  block.innerHTML = '';

  // Configuración raíz Universal Editor
  block.classList.add('hero-banner');
  block.setAttribute('data-aue-component', 'hero-banner');
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Hero Banner');

  // Track
  const track = document.createElement('div');
  track.className = 'hero-banner-track';
  track.setAttribute('aria-live', 'polite');
  slides.forEach((s) => track.append(s));

  // Prev button
  const prev = document.createElement('button');
  prev.className = 'hero-banner-prev';
  prev.setAttribute('aria-label', 'Slide anterior');
  prev.innerHTML = '&#9664;';

  // Next button
  const next = document.createElement('button');
  next.className = 'hero-banner-next';
  next.setAttribute('aria-label', 'Slide siguiente');
  next.innerHTML = '&#9654;';

  // Dots
  const dotsNav = document.createElement('div');
  dotsNav.className = 'hero-banner-dots';
  dotsNav.setAttribute('role', 'tablist');
  dotsNav.setAttribute('aria-label', 'Navegación de slides');

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-banner-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dotsNav.append(dot);
    return dot;
  });

  block.append(track, prev, next, dotsNav);

  // ── Carousel logic ───────────────────────────────────────────────
  let current = 0;
  const total = slides.length;
  let autoplayTimer;

  function goTo(index) {
    const newIndex = (index + total) % total;
    track.style.transform = `translateX(-${newIndex * 100}%)`;

    dots[current].setAttribute('aria-selected', 'false');
    slides[current].setAttribute('aria-hidden', 'true');

    current = newIndex;

    dots[current].setAttribute('aria-selected', 'true');
    slides[current].removeAttribute('aria-hidden');
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 5000);
  }

  // Init: hide non-active slides from AT
  slides.forEach((s, i) => {
    if (i !== 0) s.setAttribute('aria-hidden', 'true');
  });

  prev.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  next.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  // Keyboard nav on block
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); stopAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); stopAutoplay(); }
  });

  // Pause on hover/focus
  block.addEventListener('mouseenter', stopAutoplay);
  block.addEventListener('focusin', stopAutoplay);
  block.addEventListener('mouseleave', startAutoplay);
  block.addEventListener('focusout', (e) => {
    if (!block.contains(e.relatedTarget)) startAutoplay();
  });

  // Touch/swipe support
  let touchStartX = 0;
  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });

  // Only autoplay if more than one slide
  if (total > 1) startAutoplay();

  // Hide arrows if single slide
  if (total <= 1) {
    prev.hidden = true;
    next.hidden = true;
    dotsNav.hidden = true;
  }
}
