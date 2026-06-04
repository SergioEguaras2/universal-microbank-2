/**
 * Decorates the Cards block to match the original CarouselHighlightItem component.
 * @param {Element} block The Cards block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const TEST_IMAGE_URL = 'https://main--universal-microbank-2--sergioeguaras2.aem.live/media_134b848c697e9152f269fa3b79696b855040912ba.png?width=2000&format=webply&optimize=medium';

  const getImageUrl = (path) => {
    if (!path || path === 'negocios312x488.png') return TEST_IMAGE_URL;
    if (path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.replace(/^(\.\.\/|\.\/|\/)+/, '');
    if (cleanPath.startsWith('images/')) {
      return `https://www.microbank.com/${cleanPath}`;
    }
    return TEST_IMAGE_URL;
  };

  const section = document.createElement('section');
  section.className = 'hl-carousel no-carousel';

  let descriptionHtml = '';
  const items = [];
  let viewAllLink = null;

  rows.forEach((row, idx) => {
    const cols = [...row.children];

    if (idx === 0) {
      // First row: Title and description
      const titleText = cols[0]?.textContent.trim();
      let title = (titleText && titleText !== '1') ? cols[0].innerHTML : '<h2>Elige el préstamo que mejor se adapte a ti</h2>';
      if (title && !title.trim().startsWith('<h')) {
        title = `<h2>${title}</h2>`;
      }
      let desc = cols[1] ? cols[1].innerHTML : '<p>En MicroBank encontrarás productos de financiación a medida para que hagas realidad todos <span class="font-site texto_subrayado">tus proyectos.</span></p>';
      if (desc && !desc.trim().startsWith('<p')) {
        desc = `<p>${desc}</p>`;
      }
      // mark description elements as editable for the authoring UI
      title = title.replace(/<h([1-6])/, '<h$1 data-c2d-cmp-text-property="heading"');
      desc = desc.replace(/<p/, '<p data-c2d-cmp-text-property="description"');

      descriptionHtml = `
        <div data-aos="fade-up" class="hl-carousel-description-text aos-fast-mobile">
          ${title}
          ${desc}
        </div>
      `;
    } else if (idx === rows.length - 1 && cols[0] && cols[0].querySelector('a')) {
      // Last row: View all link
      const link = cols[0].querySelector('a');
      viewAllLink = link;
    } else {
      // Intermediate rows: Carousel Items
      const imgCol = cols[0];
      const titleText = cols[1] ? cols[1].textContent.trim() : '';
      const tagText = cols[2] ? cols[2].textContent.trim() : '';
      const nriText = cols[3] ? cols[3].textContent.trim() : '';
      const linkEl = cols[4] ? cols[4].querySelector('a') : null;

      let imgSrc = '';
      if (imgCol) {
        const img = imgCol.querySelector('img');
        if (img) {
          imgSrc = img.src;
        } else if (imgCol.textContent.trim()) {
          imgSrc = imgCol.textContent.trim();
        }
      }

      items.push({
        imgSrc: getImageUrl(imgSrc),
        title: titleText,
        tag: tagText,
        nri: nriText,
        href: linkEl ? linkEl.href : '#',
        srLabel: linkEl ? linkEl.textContent.trim() : titleText,
      });
    }
  });

  // No items parsed — use same fallback as CarouselHighlightItem.html
  if (items.length === 0) {
    const BASE = 'https://main--universal-microbank-2--sergioeguaras2.aem.live'
      + '/images/';
    const FALLBACK_IMAGES = [
      `${BASE}negocios312x488.png`,
      `${BASE}easi312x488.png`,
      `${BASE}education312x488.png`,
      `${BASE}familiar312x488.png`,
    ];
    FALLBACK_IMAGES.forEach((imgSrc) => {
      items.push({
        imgSrc,
        title: 'Lorem ipsum dolor sit amet consectetur',
        tag: 'Lorem Ipsum',
        nri: 'Lorem Ipsum',
        href: '#',
        srLabel: 'Lorem Ipsum',
      });
    });
  }

  // Ensure descriptionHtml is set if rows was empty
  if (!descriptionHtml) {
    descriptionHtml = `
      <div data-aos="fade-up" class="hl-carousel-description-text aos-fast-mobile">
        <h2>Elige el préstamo que mejor se adapte a ti</h2>
        <p>En MicroBank encontrarás productos de financiación a medida para que hagas realidad todos <span class="font-site texto_subrayado">tus proyectos.</span></p>
      </div>
    `;
  }

  // 1. Build Description
  const descContainer = document.createElement('div');
  descContainer.className = 'hl-carousel-description container tight';
  descContainer.innerHTML = `
    <div class="row">
      <div class="col">
        ${descriptionHtml}
      </div>
    </div>
  `;
  section.appendChild(descContainer);

  // 2. Build Highlights Container
  const highlightsDiv = document.createElement('div');
  highlightsDiv.className = 'hl-carousel-highlights';

  const wrap = document.createElement('div');
  wrap.className = 'hl-carousel-highlights-wrap';

  items.forEach((item, idx) => {
    const article = document.createElement('article');
    article.className = 'hl-carousel-highlights-item';
    article.setAttribute('data-c2d-cmp-name', 'CarouselHighlightItem');
    article.setAttribute('data-c2d-cmp-variants', `slide:${idx + 1}`);
    article.setAttribute('data-aos-duration', '1000');
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-offset', '100');
    article.setAttribute('data-aos-delay', `${(idx + 1) * 100}`);

    // make image and text editable/contributable in the editor
    article.innerHTML = `
      <a href="${item.href}"> 
        <span class="sr-only" data-c2d-cmp-text-property="sr-label">${item.srLabel}</span>
        <div class="hl-carousel-highlights-item-img" data-c2d-cmp-media="image"> 
          <img src="${item.imgSrc}" data-c2d-cmp-media-src="${item.imgSrc}" alt="${item.title || ''}" role="presentation" aria-hidden="true" /> 
        </div>
        <div class="hl-carousel-highlights-item-text">
          <h3 data-c2d-cmp-text-property="title">${item.title}</h3>
          ${item.tag ? `
          <div class="tags">
            <p data-c2d-cmp-text-property="tag">${item.tag}</p>
          </div>
          ` : ''}
          ${item.nri ? `
          <p class="hl-carousel-highlights-nri" data-c2d-cmp-text-property="nri">${item.nri}</p>
          ` : ''}
        </div>
      </a>
    `;
    wrap.appendChild(article);
  });
  highlightsDiv.appendChild(wrap);

  // 3. Build view all link (use fallback if no link was authored)
  const href = viewAllLink ? viewAllLink.href : '#';
  const text = viewAllLink ? viewAllLink.textContent : 'Ver todos los productos';
  const linkDiv = document.createElement('div');
  linkDiv.className = 'hl-carousel-highlights-link';
  // make link text editable
  linkDiv.innerHTML = `<p><a href="${href}" title="${text}" data-c2d-cmp-text-property="view-all">${text}</a></p>`;
  highlightsDiv.appendChild(linkDiv);

  section.appendChild(highlightsDiv);

  // assemble outer wrappers to match CarouselHighlightItem.html
  const region = document.createElement('div');
  region.className = 'region-container bg-light-black-rhomboid-bottom bg-light-black-rhomboid-top bg-h-30';

  const containerOuter = document.createElement('div');
  containerOuter.className = 'container';

  const rowOuter = document.createElement('div');
  rowOuter.className = 'row';

  const colOuter = document.createElement('div');
  colOuter.className = 'col';

  colOuter.appendChild(section);
  rowOuter.appendChild(colOuter);
  containerOuter.appendChild(rowOuter);
  region.appendChild(containerOuter);
  block.appendChild(region);
}
