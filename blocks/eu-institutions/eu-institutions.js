/**
 * eu-institutions block
 * @param {HTMLElement} block El elemento contenedor del bloque en el DOM
 */
export default function decorate(block) {
  const rows = [...block.children];

  block.innerHTML = '';

  // Configuración raíz para el Universal Editor
  block.classList.add('eu-institutions');
  block.setAttribute('data-aue-component', 'eu-institutions');
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Logos Instituciones Europeas');

  // ── Row 0: eyebrow + title ───────────────────────────────────
  const headerRow = rows[0];
  if (headerRow) {
    const cell = headerRow.children[0];
    if (cell) {
      const paras = [...cell.querySelectorAll('p')];

      if (paras[0]) {
        const eyebrow = document.createElement('p');
        eyebrow.className = 'eu-institutions-eyebrow';
        eyebrow.textContent = paras[0].textContent.trim();
        eyebrow.setAttribute('data-aue-prop', 'eyebrow');
        eyebrow.setAttribute('data-aue-type', 'text');
        block.append(eyebrow);
      }

      if (paras[1]) {
        const title = document.createElement('p');
        title.className = 'eu-institutions-title';
        title.textContent = paras[1].textContent.trim();
        title.setAttribute('data-aue-prop', 'title');
        title.setAttribute('data-aue-type', 'text');
        block.append(title);
      }
    }
  }

  // ── Rows 1+: institution items ───────────────────────────────
  const logosWrap = document.createElement('div');
  logosWrap.className = 'eu-institutions-logos';

  const itemRows = rows.slice(1);
  itemRows.forEach((row) => {
    const cells = [...row.children];
    const logoCell = cells[0];
    const textCell = cells[1];

    // Resolve link href
    let href = '#';
    const link = textCell?.querySelector('a') || logoCell?.querySelector('a');
    if (link) href = link.href;

    const item = document.createElement('a');
    item.className = 'eu-institutions-item';
    item.href = href;

    // Logo
    const logoWrap = document.createElement('div');
    logoWrap.className = 'eu-institutions-item-logo';
    logoWrap.setAttribute('data-aue-prop', 'logo');
    logoWrap.setAttribute('data-aue-type', 'media');

    const img = logoCell?.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (!img.alt) img.alt = '';
      logoWrap.append(img);
    }

    // Label (name + arrow)
    const labelWrap = document.createElement('div');
    labelWrap.className = 'eu-institutions-item-label';

    const nameEl = document.createElement('span');
    nameEl.className = 'eu-institutions-item-name';
    nameEl.setAttribute('data-aue-prop', 'name');
    nameEl.setAttribute('data-aue-type', 'text');

    // Get institution name
    let name = '';
    if (textCell) {
      const textContent = [...textCell.childNodes]
        .map((n) => n.textContent.trim())
        .filter(Boolean)
        .join(' ');
      name = link ? textContent.replace(link.textContent.trim(), '').trim()
        || link.textContent.trim() : textContent;
    }
    nameEl.textContent = name;

    const arrowEl = document.createElement('span');
    arrowEl.className = 'eu-institutions-item-arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    arrowEl.textContent = '\u2192';

    labelWrap.append(nameEl, arrowEl);
    item.append(logoWrap, labelWrap);
    logosWrap.append(item);
  });

  block.append(logosWrap);
}
