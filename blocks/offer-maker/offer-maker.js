/**
 * offer-maker.js — Bloque AEM EDS: OfferMaker
 * CSS BEM: .om-group, .om-content, .om-left, .om-title, .om-description,
 *          .om-right, .om-value
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = etiqueta izquierda (TIN/TAE), celda 1 = descripción, celda 2 = valor derecha
 *   Filas adicionales: más filas de condiciones financieras
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  const group = document.createElement('div');
  group.className = 'om-group';

  const content = document.createElement('div');
  content.className = 'om-content';

  const left = document.createElement('div');
  left.className = 'om-left';

  rows.forEach((row) => {
    const [labelCell, descCell, valueCell] = [...row.querySelectorAll(':scope > div')];

    if (labelCell) {
      const title = document.createElement('div');
      title.className = 'om-title';
      title.textContent = labelCell.textContent.trim();
      left.append(title);
    }

    if (descCell) {
      const desc = document.createElement('div');
      desc.className = 'om-description';
      desc.append(...descCell.childNodes);
      left.append(desc);
    }

    if (valueCell) {
      const right = document.createElement('div');
      right.className = 'om-right';
      const val = document.createElement('div');
      val.className = 'om-value';
      val.append(...valueCell.childNodes);
      right.append(val);
      content.append(left, right);
    }

    row.remove();
  });

  if (!content.children.length) content.append(left);
  group.append(content);
  block.append(group);
  block.classList.add('offer-maker--initialized');
}
