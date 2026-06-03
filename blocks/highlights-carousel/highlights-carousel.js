/**
 * highlights-carousel block
 *
 * Document table structure:
 *
 * | highlights-carousel                      |                          |
 * |------------------------------------------|--------------------------|
 * | Título H2                                | Ver todos los productos  |
 * | Descripción párrafo                      | (link href)              |
 * |------------------------------------------|--------------------------|
 * | [card image]   | Título tarjeta          |
 * |                | Subtítulo               |
 * |                | Nombre producto         |
 * |                | Importe                 |
 * |                | (link href)             |
 * |------------------------------------------|--------------------------|
 * | (repeat per card...)                                               |
 *
 * Row 0 = header (col 0: title + desc, col 1: "ver todos" link)
 * Rows 1+ = one card per row (col 0: image, col 1: texts + link)
 */

export default function decorate(block) {
  const rows = [...block.children];
  const isMobile = () => window.innerWidth <= 600;
  const isTablet = () => window.innerWidth <= 900;

  block.innerHTML = '';

  // ── Row 0: header ────────────────────────────────────────────
  const headerRow = rows[0];
  if (headerRow) {
    const cells = [...headerRow.children];
    const textCell = cells[0];
    const linkCell = cells[1];

    const header = document.createElement('div');
    header.className = 'highlights-carousel-header';

    const textWrap = document.createElement('div');
    textWrap.className = 'highlights-carousel-header-text';
    if (textCell) textWrap.append(...textCell.childNodes);

    header.append(textWrap);

    if (linkCell) {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        const viewAll = document.createElement('a');
        viewAll.className = 'highlights-carousel-header-link';
        viewAll.href = anchor.href;
        viewAll.textContent = anchor.textContent.trim();
        viewAll.setAttribute('aria-label', anchor.textContent.trim());
        header.append(viewAll);
      }
    }

    block.append(header);
  }

  // ── Rows 1+: cards ───────────────────────────────────────────
  const cardRows = rows.slice(1);

  const viewport = document.createElement('div');
  viewport.className = 'highlights-carousel-viewport';

  const track = document.createElement('div');
  track.className = 'highlights-carousel-track';
  track.setAttribute('aria-live', 'polite');

  cardRows.forEach((row, index) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];

    let href = '#';
    const link = textCell?.querySelector('a') || imageCell?.querySelector('a');
    if (link) href = link.href;

    const card = document.createElement('a');
    card.className = 'highlights-carousel-card';
    card.href = href;
    card.setAttribute('aria-label', `Tarjeta ${index + 1}`);

    // Background image
    const bg = document.createElement('div');
    bg.className = 'highlights-carousel-card-bg';
    const img = imageCell?.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (!img.alt) img.alt = '';
      bg.append(img);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'highlights-carousel-card-content';

    if (textCell) {
      const paras = [...textCell.querySelectorAll('p, h3, h4')];
      const texts = paras
        .map((el) => el.textContent.trim())
        .filter((t) => t && t !== link?.textContent.trim());

      const [text0, text1, text2, text3] = texts;

      if (text0) {
        const title = document.createElement('p');
        title.className = 'highlights-carousel-card-title';
        title.textContent = text0;
        content.append(title);
      }

      if (text1) {
        const subtitle = document.createElement('p');
        subtitle.className = 'highlights-carousel-card-subtitle';
        subtitle.textContent = text1;
        content.append(subtitle);
      }

      const meta = document.createElement('div');
      meta.className = 'highlights-carousel-card-meta';

      const productWrap = document.createElement('div');

      if (text2) {
        const product = document.createElement('p');
        product.className = 'highlights-carousel-card-product';
        product.textContent = text2;
        productWrap.append(product);
      }

      if (text3) {
        const amount = document.createElement('p');
        amount.className = 'highlights-carousel-card-amount';
        amount.textContent = text3;
        productWrap.append(amount);
      }

      meta.append(productWrap);
      content.append(meta);
    }

    const arrow = document.createElement('span');
    arrow.className = 'highlights-carousel-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '\u2192';
    content.append(arrow);

    card.append(bg, content);
    track.append(card);
  });

  viewport.append(track);
  block.append(viewport);

  // ── Dots & carousel logic ────────────────────────────────────
  const cards = [...track.children];
  const total = cards.length;

  function visibleCount() {
    if (isMobile()) return 1;
    if (isTablet()) return 2;
    return 4;
  }

  function maxIndex() {
    return Math.max(0, total - visibleCount());
  }

  let current = 0;

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'highlights-carousel-dots';
  dotsWrap.setAttribute('role', 'tablist');
  dotsWrap.setAttribute('aria-label', 'Navegación de tarjetas');

  function goTo(index) {
    current = Math.min(Math.max(index, 0), maxIndex());
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    const allDots = [...dotsWrap.querySelectorAll('.highlights-carousel-dot')];
    allDots.forEach((d, i) => d.setAttribute('aria-selected', i === current ? 'true' : 'false'));
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    const dots = [];
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('button');
      dot.className = 'highlights-carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir a la posición ${i + 1}`);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.append(dot);
      dots.push(dot);
    }
    return dots;
  }

  buildDots();
  block.append(dotsWrap);

  // Touch/swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(0);
    }, 150);
  });
}
