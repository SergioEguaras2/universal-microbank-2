/**
 * rich-text.js — Bloque AEM EDS: RichText
 * CSS BEM: .first-section, .rich-text
 * Bloque de contenido HTML libre — preserva el HTML interno, añade clases BEM.
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length === 1) {
      // Una sola celda: sección de texto simple
      const section = document.createElement('section');
      section.className = 'rich-text__section';
      section.append(...cells[0].childNodes);
      row.replaceWith(section);
    } else {
      // Múltiples celdas: columnas
      const wrap = document.createElement('div');
      wrap.className = 'rich-text__columns';
      cells.forEach((cell) => {
        const col = document.createElement('div');
        col.className = 'rich-text__col';
        col.append(...cell.childNodes);
        wrap.append(col);
      });
      row.replaceWith(wrap);
    }
  });

  block.classList.add('rich-text--initialized');
}
