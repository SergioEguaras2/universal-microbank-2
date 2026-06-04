/**
 * editorial-body.js — Bloque AEM EDS: EditorialBody
 * CSS BEM: .contenedor_exterior_columnas, .estilo_col_derecha, .estilo_col_izquierda
 *
 * Entrada AEM:
 *   Cada fila = una sección editorial. Si tiene 2 celdas → dos columnas (img + texto).
 *   Si tiene 1 celda → contenido a ancho completo.
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length === 2) {
      const [leftCell, rightCell] = cells;
      const container = document.createElement('div');
      container.className = 'contenedor_exterior_columnas';

      const left = document.createElement('div');
      left.className = 'estilo_col_izquierda';
      left.append(...leftCell.childNodes);

      const right = document.createElement('div');
      right.className = 'estilo_col_derecha';
      right.append(...rightCell.childNodes);

      container.append(left, right);
      row.replaceWith(container);
    } else if (cells.length === 1) {
      const section = document.createElement('div');
      section.className = 'editorial-body__section';
      section.append(...cells[0].childNodes);
      row.replaceWith(section);
    }
  });

  block.classList.add('editorial-body--initialized');
}
