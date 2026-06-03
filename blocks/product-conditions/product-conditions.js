/**
 * product-conditions.js — Bloque AEM EDS: ProductConditions
 * CSS BEM: .product-conditions, (contiene componente .alt-highlights internamente)
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = ID opcional (ej: "landing_medios-condiciones")
 *   Filas 1..N: condiciones del producto (celda 0 = etiqueta, celda 1 = valor)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  // Detectar si primera fila es configuración (ID)
  const firstCells = [...(rows[0]?.querySelectorAll(':scope > div') ?? [])];
  let configRow = null;
  let itemRows = rows;
  if (firstCells.length === 1 && !firstCells[0]?.querySelector('img, a')) {
    configRow = rows[0];
    const idVal = firstCells[0].textContent.trim();
    if (idVal) block.id = idVal;
    itemRows = rows.slice(1);
  }

  // Lista de condiciones
  const list = document.createElement('ul');
  list.className = 'product-conditions__list';

  itemRows.forEach((row) => {
    const [labelCell, valueCell] = [...row.querySelectorAll(':scope > div')];

    const li = document.createElement('li');
    li.className = 'product-conditions__item';

    if (labelCell) {
      const label = document.createElement('span');
      label.className = 'product-conditions__label';
      label.textContent = labelCell.textContent.trim();
      li.append(label);
    }
    if (valueCell) {
      const value = document.createElement('span');
      value.className = 'product-conditions__value';
      const clones = Array.from(valueCell.childNodes).map(n => n.cloneNode(true));
      value.append(...clones);
      li.append(value);
    }

    list.append(li);
  });

  // Mantener filas originales (no eliminar configRow) y añadir lista de condiciones
  block.append(list);
  block.classList.add('product-conditions--initialized');
}
