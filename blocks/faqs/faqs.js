/**
 * faqs.js — Bloque AEM EDS: Faqs
 * CSS BEM: .faqs, .faqs__intro, .faqs__list-wrap, .faqs__list,
 *          .faqs__item.accordion-item, .faqs__item-question button.accordion-button,
 *          .faqs__item-answer.accordion-collapse.collapse[.show]
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = título intro, celda 1 = texto intro (opcional)
 *   Filas 1..N: celda 0 = pregunta, celda 1 = respuesta
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  // Detectar si la primera fila es un intro (dos celdas no vacías donde la 1ª parece título)
  let introRow = null;
  let itemRows = rows;
  const firstCells = [...(rows[0]?.querySelectorAll(':scope > div') ?? [])];
  const isIntro = firstCells.length >= 1 && firstCells[0]?.querySelector('h1, h2, h3, strong');
  if (isIntro) {
    introRow = rows[0];
    itemRows = rows.slice(1);
  }

  // Intro
  if (introRow) {
    const intro = document.createElement('div');
    intro.className = 'faqs__intro';
    const [tCell, pCell] = [...introRow.querySelectorAll(':scope > div')];
    if (tCell) intro.append(...tCell.childNodes);
    if (pCell) intro.append(...pCell.childNodes);
    introRow.replaceWith(intro);
  }

  // Lista de preguntas
  const listWrap = document.createElement('div');
  listWrap.className = 'faqs__list-wrap';
  const list = document.createElement('ul');
  list.className = 'faqs__list';

  itemRows.forEach((row, i) => {
    const [qCell, aCell] = [...row.querySelectorAll(':scope > div')];
    const btnId = `faqs-btn-${i}`;
    const panelId = `faqs-panel-${i}`;

    const item = document.createElement('li');
    item.className = 'faqs__item accordion-item';

    // Botón pregunta
    const qWrap = document.createElement('div');
    qWrap.className = 'faqs__item-question';
    const btn = document.createElement('button');
    btn.className = 'accordion-button collapsed';
    btn.id = btnId;
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', panelId);
    btn.textContent = qCell?.textContent.trim() ?? '';
    qWrap.append(btn);

    // Panel respuesta
    const panel = document.createElement('div');
    panel.className = 'faqs__item-answer accordion-collapse collapse';
    panel.id = panelId;
    panel.setAttribute('aria-labelledby', btnId);
    const body = document.createElement('div');
    body.className = 'accordion-body';
    if (aCell) body.append(...aCell.childNodes);
    panel.append(body);

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.classList.toggle('collapsed', open);
      panel.classList.toggle('show', !open);
    });

    item.append(qWrap, panel);
    list.append(item);
    row.remove();
  });

  listWrap.append(list);
  block.append(listWrap);
  block.classList.add('faqs--initialized');
}
