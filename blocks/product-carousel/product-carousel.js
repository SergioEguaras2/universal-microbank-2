/**
 * product-carousel block
 * Bloque AEM EDS / Universal Editor basado en el patrón de video-banner.
 * - Vanilla JS
 * - Clases en kebab-case
 * - Sin librerías externas
 * - CSS acotado al componente
 * @param {HTMLElement} block Elemento raíz del bloque
 */

const DEFAULT_CARDS = [
  {
    image: '/assets/product-carousel-negocios.jpg',
    alt: 'Persona emprendedora en su negocio',
    kicker: 'Negocios y emprendedores',
    title: 'Impulsa tu negocio',
    text: 'Financiación pensada para iniciar, ampliar o consolidar tu proyecto.',
    linkText: 'Conoce los préstamos',
    linkUrl: '#',
  },
  {
    image: '/assets/product-carousel-estudiantes.jpg',
    alt: 'Estudiante trabajando con un ordenador',
    kicker: 'Estudiantes',
    title: 'Haz realidad tus estudios',
    text: 'Soluciones para ayudarte a seguir formándote y avanzar en tu futuro.',
    linkText: 'Ver financiación',
    linkUrl: '#',
  },
  {
    image: '/assets/product-carousel-particulares.jpg',
    alt: 'Persona consultando información financiera',
    kicker: 'Particulares',
    title: 'Apoyo para tus proyectos',
    text: 'Opciones de financiación para necesidades personales y familiares.',
    linkText: 'Descubre más',
    linkUrl: '#',
  },
];

function textFromCell(cell) {
  return cell?.textContent?.trim() || '';
}

function imageFromCell(cell) {
  const img = cell?.querySelector('img');

  return {
    src: img?.src || textFromCell(cell),
    alt: img?.alt || '',
  };
}

function normaliseUrl(value) {
  const url = value?.trim();
  return url || '#';
}

function getCardsFromRows(rows) {
  const cardRows = rows.slice(3);

  if (!cardRows.length) {
    return DEFAULT_CARDS;
  }

  const cards = cardRows.map((row, index) => {
    const cells = [...row.children];
    const image = imageFromCell(cells[0]);
    const defaultCard = DEFAULT_CARDS[index % DEFAULT_CARDS.length];

    return {
      image: image.src || defaultCard.image,
      alt: image.alt || textFromCell(cells[1]) || defaultCard.alt,
      kicker: textFromCell(cells[1]) || defaultCard.kicker,
      title: textFromCell(cells[2]) || defaultCard.title,
      text: textFromCell(cells[3]) || defaultCard.text,
      linkText: textFromCell(cells[4]) || defaultCard.linkText,
      linkUrl: normaliseUrl(
        textFromCell(cells[5]) || defaultCard.linkUrl,
      ),
    };
  });

  return cards.filter((card) => card.title || card.image);
}

function createButton(className, label, text) {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}

function getCurrentIndex(viewport, items) {
  const track = viewport.querySelector('.product-carousel-track');
  const itemWidth = items[0]?.getBoundingClientRect().width || 1;
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;

  return Math.round(viewport.scrollLeft / (itemWidth + gap));
}

function updateState(viewport, items, dots, prevButton, nextButton) {
  const currentIndex = getCurrentIndex(viewport, items);
  const maxIndex = Math.max(items.length - 1, 0);

  dots.forEach((dot, index) => {
    dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
  });

  prevButton.disabled = currentIndex <= 0;
  nextButton.disabled = currentIndex >= maxIndex;
}

function createCard(card, index) {
  const item = document.createElement('li');
  item.className = 'product-carousel-item';

  const link = document.createElement('a');
  link.className = 'product-carousel-card';
  link.href = card.linkUrl;
  link.setAttribute('aria-label', `${card.title}. ${card.linkText}`);

  const image = document.createElement('img');
  image.className = 'product-carousel-image';
  image.src = card.image;
  image.alt = card.alt;
  image.loading = index === 0 ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.width = 420;
  image.height = 520;

  const content = document.createElement('div');
  content.className = 'product-carousel-card-content';

  const kicker = document.createElement('p');
  kicker.className = 'product-carousel-card-kicker';
  kicker.textContent = card.kicker;

  const cardTitle = document.createElement('h3');
  cardTitle.className = 'product-carousel-card-title';
  cardTitle.textContent = card.title;

  const text = document.createElement('p');
  text.className = 'product-carousel-card-text';
  text.textContent = card.text;

  const linkText = document.createElement('span');
  linkText.className = 'product-carousel-card-link';
  linkText.textContent = card.linkText;

  content.append(kicker, cardTitle, text, linkText);
  link.append(image, content);
  item.append(link);

  return item;
}

function createDot(card, index, track, viewport) {
  const dot = createButton(
    'product-carousel-dot',
    `Ir a ${card.title}`,
    '',
  );

  dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
  dot.addEventListener('click', () => {
    viewport.scrollTo({
      left: track.children[index].offsetLeft,
      behavior: 'smooth',
    });
  });

  return dot;
}

export default function decorate(block) {
  const rows = [...block.children];
  const firstRowCells = [...(rows[0]?.children || [])];
  const secondRowCells = [...(rows[1]?.children || [])];
  const thirdRowCells = [...(rows[2]?.children || [])];

  const eyebrow = textFromCell(firstRowCells[0])
    || 'Préstamos que se adaptan a ti';
  const title = textFromCell(secondRowCells[0])
    || '¿Qué préstamo se adapta mejor a tu negocio?';
  const description = textFromCell(thirdRowCells[0])
    || 'Elige la solución que mejor encaja con tus necesidades.';
  const cards = getCardsFromRows(rows);

  block.innerHTML = '';
  block.classList.add('product-carousel');
  block.setAttribute('data-aue-component', 'product-carousel');
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Carrusel de productos');

  const container = document.createElement('div');
  container.className = 'product-carousel-container';

  const header = document.createElement('header');
  header.className = 'product-carousel-header';

  const eyebrowEl = document.createElement('p');
  eyebrowEl.className = 'product-carousel-eyebrow';
  eyebrowEl.textContent = eyebrow;
  eyebrowEl.setAttribute('data-aue-prop', 'eyebrow');
  eyebrowEl.setAttribute('data-aue-type', 'text');

  const titleEl = document.createElement('h2');
  titleEl.className = 'product-carousel-title';
  titleEl.textContent = title;
  titleEl.setAttribute('data-aue-prop', 'title');
  titleEl.setAttribute('data-aue-type', 'text');

  const descriptionEl = document.createElement('p');
  descriptionEl.className = 'product-carousel-description';
  descriptionEl.textContent = description;
  descriptionEl.setAttribute('data-aue-prop', 'description');
  descriptionEl.setAttribute('data-aue-type', 'text');

  header.append(eyebrowEl, titleEl, descriptionEl);

  const viewportWrapper = document.createElement('div');
  viewportWrapper.className = 'product-carousel-viewport-wrapper';

  const viewport = document.createElement('div');
  viewport.className = 'product-carousel-viewport';
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', title);
  viewport.tabIndex = 0;

  const track = document.createElement('ul');
  track.className = 'product-carousel-track';

  cards.forEach((card, index) => {
    track.append(createCard(card, index));
  });

  viewport.append(track);
  viewportWrapper.append(viewport);

  const controls = document.createElement('div');
  controls.className = 'product-carousel-controls';

  const dots = document.createElement('div');
  dots.className = 'product-carousel-dots';
  dots.setAttribute('aria-label', 'Paginación del carrusel');

  const dotButtons = cards.map((card, index) => {
    const dot = createDot(card, index, track, viewport);
    dots.append(dot);
    return dot;
  });

  const arrows = document.createElement('div');
  arrows.className = 'product-carousel-arrows';

  const prevButton = createButton(
    'product-carousel-arrow product-carousel-arrow-prev',
    'Ver tarjeta anterior',
    '‹',
  );

  const nextButton = createButton(
    'product-carousel-arrow product-carousel-arrow-next',
    'Ver tarjeta siguiente',
    '›',
  );

  prevButton.addEventListener('click', () => {
    viewport.scrollBy({ left: -viewport.clientWidth, behavior: 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    viewport.scrollBy({ left: viewport.clientWidth, behavior: 'smooth' });
  });

  arrows.append(prevButton, nextButton);
  controls.append(dots, arrows);
  container.append(header, viewportWrapper, controls);
  block.append(container);

  const items = [...track.children];
  const sync = () => {
    updateState(viewport, items, dotButtons, prevButton, nextButton);
  };

  viewport.addEventListener(
    'scroll',
    () => window.requestAnimationFrame(sync),
    { passive: true },
  );
  window.addEventListener('resize', sync);
  sync();
}
