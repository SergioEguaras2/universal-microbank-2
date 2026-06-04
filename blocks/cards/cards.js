import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const TEST_IMAGE_URL = 'https://main--universal-microbank-2--sergioeguaras2.aem.live/media_134b848c697e9152f269fa3b79696b855040912ba.png?width=2000&format=webply&optimize=medium';

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    // If no picture is present in the card, prepend the default test image
    const hasPicture = li.querySelector('picture');
    if (!hasPicture) {
      const imgDiv = document.createElement('div');
      imgDiv.innerHTML = `<picture><img src="${TEST_IMAGE_URL}" alt="Default Card Image" /></picture>`;
      li.prepend(imgDiv);
    }

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    // Only optimize if it's not the external test URL
    if (img.src.startsWith(window.location.origin) || img.src.startsWith('/')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  block.replaceChildren(ul);
}
