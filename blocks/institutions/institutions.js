/**
 * Decorates the Institutions block to match the original EuInstitutionItem component.
 * @param {Element} block The Institutions block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

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
      // Col 0: Institution name
      // Col 1: Logo image (or image name/img element)
      // Col 2: Image alt text
      // Col 3: Link (anchor element)
      // Col 4: Variant identifier (e.g. bei, fei, ceb)
      const nameText = cols[0] ? cols[0].textContent.trim() : 'Lorem Ipsum';
      const imgCol = cols[1];
      const altText = cols[2] ? cols[2].textContent.trim() : 'Logo';
      const linkEl = cols[3] ? cols[3].querySelector('a') : null;
      const variant = cols[4] ? cols[4].textContent.trim() : 'bei';

      let imgSrc = '../images/EIB-color.png';
      if (imgCol) {
        const img = imgCol.querySelector('img');
        if (img) {
          imgSrc = img.src;
        } else if (imgCol.textContent.trim()) {
          imgSrc = `../images/${imgCol.textContent.trim()}`;
        }
      }

      items.push({
        name: nameText,
        imgSrc,
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
