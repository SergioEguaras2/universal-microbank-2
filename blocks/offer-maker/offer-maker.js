import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'om-group';

  const content = document.createElement('div');
  content.className = 'om-content';

  const leftArea = document.createElement('div');
  leftArea.className = 'om-left';

  const boxesContainer = document.createElement('div');
  boxesContainer.className = 'om-boxes';

  const rows = [...block.children];

  if (rows.length === 0) return;

  // Assume first row is header if we have multiple rows and no interest rates in it
  let startIdx = 0;
  const firstRow = rows[0];
  const firstRowText = firstRow.textContent.toLowerCase();

  const hasHeaderRow = rows.length > 1
    && (!firstRowText.includes('tin') && !firstRowText.includes('tae') && !firstRowText.includes('%'));

  if (hasHeaderRow) {
    moveInstrumentation(firstRow, leftArea);
    const titleEl = firstRow.querySelector('h1, h2, h3, h4, h5, h6, p strong');

    const title = document.createElement('h2');
    title.className = 'om-title';
    if (titleEl) {
      title.textContent = titleEl.textContent;
    } else {
      title.textContent = firstRow.firstElementChild
        ? firstRow.firstElementChild.textContent
        : '';
    }

    const desc = document.createElement('p');
    desc.className = 'om-description';
    if (titleEl && titleEl.nextElementSibling) {
      desc.innerHTML = titleEl.nextElementSibling.innerHTML;
    } else if (firstRow.children[1]) {
      desc.innerHTML = firstRow.children[1].innerHTML;
    } else {
      desc.textContent = firstRow.textContent.replace(title.textContent, '').trim();
    }

    leftArea.append(title, desc);
    startIdx = 1;
  } else {
    const title = document.createElement('h2');
    title.className = 'om-title';
    title.textContent = 'Nuestras Ofertas';
    const desc = document.createElement('p');
    desc.className = 'om-description';
    desc.textContent = 'Compara y encuentra el préstamo que mejor se adapte a tus necesidades.';
    leftArea.append(title, desc);
  }

  // Process the offer rows
  for (let i = startIdx; i < rows.length; i += 1) {
    const row = rows[i];
    const box = document.createElement('div');
    box.className = 'om-box';
    moveInstrumentation(row, box);

    // 4 Cells mapping:
    // Cell 0: Title
    // Cell 1: TIN / TAE
    // Cell 2: Monthly installment
    // Cell 3: Description / link
    const cells = [...row.children];

    if (cells.length > 0) {
      const titleVal = cells[0]?.textContent?.trim() || 'Préstamo';
      const tinTaeVal = cells[1]?.textContent?.trim() || '';
      const instVal = cells[2]?.textContent?.trim() || '-';
      const descHTML = cells[3]?.innerHTML || '';

      // Try to split TIN / TAE value if possible
      let tin = '-';
      let tae = '-';
      if (tinTaeVal.includes('/')) {
        const parts = tinTaeVal.split('/');
        tin = parts[0].trim();
        tae = parts[1].trim();
      } else {
        tin = tinTaeVal;
        tae = tinTaeVal;
      }

      box.innerHTML = `
        <div class="om-box-header">
          <h3 class="om-box-title">${titleVal}</h3>
        </div>
        <div class="om-box-rates">
          <div class="om-rate-item">
            <span class="om-rate-label">TIN</span>
            <span class="om-rate-value">${tin}</span>
          </div>
          <div class="om-rate-item">
            <span class="om-rate-label">TAE</span>
            <span class="om-rate-value">${tae}</span>
          </div>
        </div>
        <div class="om-box-installment">
          <span class="om-inst-label">Cuota mensual</span>
          <span class="om-inst-value">${instVal}</span>
        </div>
        <div class="om-box-description">
          ${descHTML}
        </div>
      `;
      boxesContainer.append(box);
    }
  }

  content.append(leftArea, boxesContainer);
  container.append(content);
  block.replaceChildren(container);
}
