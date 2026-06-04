/**
 * Decorates the Hero block to match the original HeroSlide banner.
 * @param {Element} block The Hero block element
 */
export default function decorate(block) {
  const slides = [...block.children];
  block.innerHTML = '';

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) {
      return path;
    }
    const cleanPath = path.replace(/^(\.\.\/|\.\/|\/)+/, '');
    if (cleanPath.startsWith('images/')) {
      return `https://www.microbank.com/${cleanPath}`;
    }
    return `https://www.microbank.com/images/${cleanPath}`;
  };

  // Create play/pause button
  const togglePlay = document.createElement('div');
  togglePlay.className = 'principal-banner__container-toggle container';
  togglePlay.innerHTML = `
    <button id="toggle-play" class="principal-banner__toggle pause" tabindex="0" aria-label="Pausar video" aria-pressed="false"> 
      <svg role="presentation" xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
        <path d="M1.66667 11.6667C2.58333 11.6667 3.33333 10.9167 3.33333 10V1.66667C3.33333 0.75 2.58333 0 1.66667 0C0.75 0 0 0.75 0 1.66667V10C0 10.9167 0.75 11.6667 1.66667 11.6667ZM6.66667 1.66667V10C6.66667 10.9167 7.41667 11.6667 8.33333 11.6667C9.25 11.6667 10 10.9167 10 10V1.66667C10 0.75 9.25 0 8.33333 0C7.41667 0 6.66667 0.75 6.66667 1.66667Z" fill="white" />
      </svg> 
    </button>
  `;
  block.appendChild(togglePlay);

  const carousel = document.createElement('div');
  carousel.className = 'principal-banner__carousel';

  slides.forEach((slide, idx) => {
    const cols = [...slide.children];
    
    let imageContainer = null;
    let titleText = '';
    let captionHtml = '';
    let buttonLink = null;

    if (cols.length === 1) {
      // Single cell authoring
      const content = cols[0];
      const picture = content.querySelector('picture');
      if (picture) {
        imageContainer = content;
      } else {
        titleText = content.textContent;
      }
    } else {
      // Standard multi-cell authoring
      imageContainer = cols[0];
      titleText = cols[1] ? cols[1].textContent : '';
      captionHtml = cols[2] ? cols[2].innerHTML : '';
      buttonLink = cols[3] ? cols[3].querySelector('a') : null;
    }

    const item = document.createElement('div');
    item.className = `principal-banner__carousel-item titulo_negativo ${idx === 0 ? 'active' : ''}`;
    item.setAttribute('data-c2d-cmp-name', 'HeroSlide');
    item.setAttribute('data-c2d-cmp-variants', `slide:${idx + 1}`);

    // Reconstruct picture structure
    const media = document.createElement('div');
    media.className = 'principal-banner__media';
    const wrap = document.createElement('div');
    wrap.className = 'principal-banner__image-wrap';
    const group = document.createElement('div');
    group.className = 'principal-banner__image-group';
    group.innerHTML = '<div class="principal-banner__image-mask"></div>';

    // Extract dynamic picture(s) authored by the user
    const pictures = imageContainer ? [...imageContainer.querySelectorAll('picture')] : [];
    
    if (pictures.length >= 3) {
      // If author provided 3 pictures for responsive screens
      pictures[0].querySelector('img')?.classList.add('original');
      pictures[1].querySelector('img')?.classList.add('medium');
      pictures[2].querySelector('img')?.classList.add('small');
      
      group.appendChild(pictures[0]);
      group.appendChild(pictures[1]);
      group.appendChild(pictures[2]);
    } else if (pictures.length > 0) {
      // If author provided 1 or 2 pictures, make the first one visible on all screens
      const pic = pictures[0];
      const img = pic.querySelector('img');
      if (img) {
        img.className = 'original medium small';
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
      }
      group.appendChild(pic);
    } else {
      // Fallback pattern if no image is authored (using production microbank absolute assets)
      const fallbackPicture = document.createElement('picture');
      fallbackPicture.innerHTML = `
        <img src="${getImageUrl('images/microbank_collage_v1_1920x776_bn.jpg')}" class="original" alt="" role="presentation" /> 
        <img src="${getImageUrl('images/microbank_collage_v1_1440x876_bn.jpg')}" class="medium" alt="" role="presentation" /> 
        <img src="${getImageUrl('images/microbank_collage_v1_768x812_bn.jpg')}" class="small" alt="" role="presentation" />
      `;
      group.appendChild(fallbackPicture);
    }

    wrap.appendChild(group);
    media.appendChild(wrap);
    item.appendChild(media);

    // Text content
    const textContainer = document.createElement('div');
    textContainer.className = 'principal-banner__text container';
    
    const row = document.createElement('div');
    row.className = 'row';
    const col = document.createElement('div');
    col.className = 'col';

    if (titleText) {
      const h2 = document.createElement('h2');
      h2.className = 'principal-banner__title';
      h2.setAttribute('data-c2d-cmp-text-property', 'title');
      h2.textContent = titleText;
      col.appendChild(h2);
    }

    if (captionHtml) {
      const captionDiv = document.createElement('div');
      captionDiv.className = 'principal-banner__caption animated';
      captionDiv.innerHTML = `<p data-c2d-cmp-text-property="caption">${captionHtml}</p>`;
      col.appendChild(captionDiv);
    }

    if (buttonLink) {
      const buttonWrap = document.createElement('div');
      buttonWrap.className = 'button_wrap principal-banner__button';
      buttonWrap.innerHTML = `
        <span class="btn btn-yellow">
          <a href="${buttonLink.href}" title="${buttonLink.title || 'Saber más'}" data-c2d-cmp-text-property="button_label">${buttonLink.textContent}</a>
        </span>
      `;
      col.appendChild(buttonWrap);
    }

    row.appendChild(col);
    textContainer.appendChild(row);
    item.appendChild(textContainer);

    carousel.appendChild(item);
  });

  block.appendChild(carousel);

  const dots = document.createElement('div');
  dots.className = 'principal-banner__slick-dots container';
  block.appendChild(dots);
}
