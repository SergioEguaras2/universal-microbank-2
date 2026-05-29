import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'product-conditions-container';

  let startIdx = 0;
  const firstRow = rows[0];

  // Determine if the first row is the main block header
  const firstRowCells = [...firstRow.children];
  const hasHeader = rows.length > 1
    && (firstRowCells.length < 3 || firstRow.querySelector('h1, h2, h3, h4'));

  if (hasHeader) {
    const textGroup = document.createElement('div');
    textGroup.className = 'product-conditions-text';
    moveInstrumentation(firstRow, textGroup);

    const titleEl = firstRow.querySelector('h1, h2, h3, h4, h5, h6, strong');
    const title = document.createElement('h2');
    title.innerHTML = titleEl ? titleEl.innerHTML : (firstRowCells[0]?.innerHTML || '');
    textGroup.append(title);

    if (firstRowCells[1]) {
      const desc = document.createElement('p');
      desc.innerHTML = firstRowCells[1].innerHTML;
      textGroup.append(desc);
    } else if (titleEl && titleEl.nextElementSibling) {
      const desc = document.createElement('p');
      desc.innerHTML = titleEl.nextElementSibling.innerHTML;
      textGroup.append(desc);
    }
    container.append(textGroup);
    startIdx = 1;
  }

  const list = document.createElement('ul');
  list.className = 'product-conditions-list';

  for (let i = startIdx; i < rows.length; i += 1) {
    const row = rows[i];
    const li = document.createElement('li');
    li.className = 'product-conditions-item';
    moveInstrumentation(row, li);

    const wrap = document.createElement('div');
    wrap.className = 'product-conditions-item-wrap';

    const cells = [...row.children];
    if (cells.length > 0) {
      const titleVal = cells[0]?.textContent?.trim() || '';
      const valueVal = cells[1]?.innerHTML?.trim() || '';
      const tooltipVal = cells[2]?.textContent?.trim() || '';
      const infoVal = cells[3]?.innerHTML?.trim() || '';

      // Title & Optional Tooltip
      const titleDiv = document.createElement('div');
      titleDiv.className = 'product-conditions-item-title';

      const h3 = document.createElement('h3');
      h3.textContent = titleVal;
      titleDiv.append(h3);

      if (tooltipVal) {
        const tooltipBtn = document.createElement('button');
        tooltipBtn.className = 'product-conditions-item-tooltip';
        tooltipBtn.setAttribute('type', 'button');
        tooltipBtn.setAttribute('aria-label', tooltipVal);
        tooltipBtn.setAttribute('title', tooltipVal);

        // Native HTML tooltip content for hover CSS display
        const tooltipSpan = document.createElement('span');
        tooltipSpan.className = 'product-conditions-tooltip-text';
        tooltipSpan.textContent = tooltipVal;
        tooltipBtn.append(tooltipSpan);

        tooltipBtn.insertAdjacentHTML('beforeend', `
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.5" cy="8" r="6.6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8.5 11.3v0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M7.17 5.35c.16-.2.37-.38.6-.5.25-.12.5-.18.77-.18.27 0 .53.06.77.18s.45.3.6.5c.16.22.27.47.32.73.05.27.04.54-.03.8a1.6 1.6 0 01-.4 1.2c-.2.2-.42.35-.67.45a.9.9 0 00-.5.6v.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `);
        titleDiv.append(tooltipBtn);
      }
      wrap.append(titleDiv);

      // Value text
      const valueDiv = document.createElement('div');
      valueDiv.className = 'product-conditions-item-text';
      valueDiv.innerHTML = valueVal.startsWith('<p>') ? valueVal : `<p>${valueVal}</p>`;
      wrap.append(valueDiv);

      // Optional extra info
      if (infoVal) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'product-conditions-item-info';
        infoDiv.innerHTML = infoVal.startsWith('<p>') ? infoVal : `<p>${infoVal}</p>`;
        wrap.append(infoDiv);
      }

      li.append(wrap);
      list.append(li);
    }
  }

  container.append(list);
  block.replaceChildren(container);
}
