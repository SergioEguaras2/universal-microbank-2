/**
 * eu-institutions block
 * @param {HTMLElement} block El elemento contenedor del bloque en el DOM
 */
export default function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = block.dataset.eyebrow
    || (rows[0]?.children[0]?.querySelectorAll('p')[0]?.textContent.trim())
    || 'Construimos nuestro valor social';

  const titleText = block.dataset.title
    || (rows[0]?.children[0]?.querySelectorAll('p')[1]?.textContent.trim())
    || 'Con el apoyo de instituciones europeas';

  block.innerHTML = '';

  // ── Eyebrow ──────────────────────────────────────────────────
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eu-institutions-eyebrow';
  eyebrow.textContent = eyebrowText;
  eyebrow.setAttribute('data-aue-prop', 'eyebrow');
  eyebrow.setAttribute('data-aue-type', 'text');

  // ── Title ────────────────────────────────────────────────────
  const title = document.createElement('p');
  title.className = 'eu-institutions-title';
  title.textContent = titleText;
  title.setAttribute('data-aue-prop', 'title');
  title.setAttribute('data-aue-type', 'text');

  // ── Logos row ────────────────────────────────────────────────
  const logosWrap = document.createElement('div');
  logosWrap.className = 'eu-institutions-logos';

  const itemRows = rows.slice(1);

  if (itemRows.length > 0) {
    // Lee las filas del documento si existen
    itemRows.forEach((row) => {
      const cells = [...row.children];
      const logoCell = cells[0];
      const textCell = cells[1];

      let href = '#';
      const link = textCell?.querySelector('a') || logoCell?.querySelector('a');
      if (link) href = link.href;

      const item = document.createElement('a');
      item.className = 'eu-institutions-item';
      item.href = href;

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

      const labelWrap = document.createElement('div');
      labelWrap.className = 'eu-institutions-item-label';

      const nameEl = document.createElement('span');
      nameEl.className = 'eu-institutions-item-name';
      nameEl.setAttribute('data-aue-prop', 'name');
      nameEl.setAttribute('data-aue-type', 'text');

      let name = '';
      if (textCell) {
        const textContent = [...textCell.childNodes]
          .map((n) => n.textContent.trim())
          .filter(Boolean)
          .join(' ');
        name = link
          ? textContent.replace(link.textContent.trim(), '').trim() || link.textContent.trim()
          : textContent;
      }
      nameEl.textContent = name;

      const arrowEl = document.createElement('span');
      arrowEl.className = 'eu-institutions-item-arrow';
      arrowEl.setAttribute('aria-hidden', 'true');
      arrowEl.textContent = '→';

      labelWrap.append(nameEl, arrowEl);
      item.append(logoWrap, labelWrap);
      logosWrap.append(item);
    });
  } else {
    // Fallback hardcodeado si no hay filas en el documento
    const institutions = [
      { name: 'Banco Europeo de Inversiones (BEI)', href: '#' },
      { name: 'Fondo Europeo de Inversiones (FEI)', href: '#' },
      { name: 'Banco de Desarrollo del Consejo de Europa (CEB)', href: '#' },
    ];

    institutions.forEach(({ name, href }) => {
      const item = document.createElement('a');
      item.className = 'eu-institutions-item';
      item.href = href;

      const logoWrap = document.createElement('div');
      logoWrap.className = 'eu-institutions-item-logo';
      logoWrap.setAttribute('data-aue-prop', 'logo');
      logoWrap.setAttribute('data-aue-type', 'media');

      const labelWrap = document.createElement('div');
      labelWrap.className = 'eu-institutions-item-label';

      const nameEl = document.createElement('span');
      nameEl.className = 'eu-institutions-item-name';
      nameEl.setAttribute('data-aue-prop', 'name');
      nameEl.setAttribute('data-aue-type', 'text');
      nameEl.textContent = name;

      const arrowEl = document.createElement('span');
      arrowEl.className = 'eu-institutions-item-arrow';
      arrowEl.setAttribute('aria-hidden', 'true');
      arrowEl.textContent = '→';

      labelWrap.append(nameEl, arrowEl);
      item.append(logoWrap, labelWrap);
      logosWrap.append(item);
    });
  }

  block.append(eyebrow, title, logosWrap);
}
