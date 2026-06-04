/**
 * Decorates the Institutions block to match the original EuInstitutionItem component.
 * @param {Element} block The Institutions block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const TEST_IMAGE_URL = 'https://main--universal-microbank-2--sergioeguaras2.aem.live/media_134b848c697e9152f269fa3b79696b855040912ba.png?width=2000&format=webply&optimize=medium';

  const getImageUrl = (path) => {
    if (!path || path === 'EIB-color.png') return TEST_IMAGE_URL;
    if (path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.replace(/^(\.\.\/|\.\/|\/)+/, '');
    if (cleanPath.startsWith('images/')) {
      return `https://www.microbank.com/${cleanPath}`;
    }
    return `https://www.microbank.com/images/${cleanPath}`;
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'eu-institutions';

  let subtitleText = 'Construimos nuestro valor social';
  let titleText = 'Con el apoyo de instituciones europeas';
  const items = [];

  rows.forEach((row, idx) => {
    const cols = [...row.children];

    if (idx === 0) {
      // First row: Subtitle and Title
      subtitleText = cols[0] ? cols[0].textContent.trim() : subtitleText;
      titleText = cols[1] ? cols[1].textContent.trim() : titleText;
    } else {
      // Intermediate rows: Institution Items
      const nameText = cols[0] ? cols[0].textContent.trim() : 'Lorem Ipsum';
      const imgCol = cols[1];
      const altText = cols[2] ? cols[2].textContent.trim() : 'Logo';
      const linkEl = cols[3] ? cols[3].querySelector('a') : null;
      const variant = cols[4] ? cols[4].textContent.trim() : 'bei';

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
        name: nameText,
        imgSrc: getImageUrl(imgSrc),
        alt: altText,
        href: linkEl ? linkEl.href : '#',
        title: linkEl ? linkEl.title || nameText : nameText,
        variant
      });
    }
  });

  // Render header
  const pSubtitle = document.createElement('p');
  pSubtitle.textContent = subtitleText;
  wrapper.appendChild(pSubtitle);

  const pTitle = document.createElement('p');
  pTitle.className = 'eu-institutions-title';
  pTitle.textContent = titleText;
  wrapper.appendChild(pTitle);

  // Render items list
  const list = document.createElement('ul');
  list.className = 'eu-institutions__wrap';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'eu-institutions__item';
    li.setAttribute('data-c2d-cmp-name', 'EuInstitutionItem');
    li.setAttribute('data-c2d-cmp-variants', `institution:${item.variant}`);

    li.innerHTML = `
      <a class="eu-institutions__item-link" href="${item.href}" title="${item.title}" target="_blank">
        <p data-c2d-cmp-text-property="name">${item.name}</p>
        <div class="eu-institutions__item-img"> 
          <img class="lazyload" src="${item.imgSrc}" alt="${item.alt}" /> 
        </div>
      </a>
    `;
    list.appendChild(li);
  });

  wrapper.appendChild(list);
  block.appendChild(wrapper);
}
