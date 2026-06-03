/**
 * breadcrumb.js — Bloque AEM EDS: Breadcrumb
 * CSS BEM: .region-breadcrumb, .region-breadcrumb--transparent,
 *          .region-breadcrumb--black, .breadcrumb ul li.primero/.ultimo/.current
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = variante ("transparent" | "black"), celdas 1..N = niveles
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const cells = rows[0] ? [...rows[0].querySelectorAll(':scope > div')] : [];

  // Primera celda determina la variante visual
  const variant = cells[0]?.textContent.trim().toLowerCase() || '';
  const modClass = variant === 'transparent'
    ? 'region-breadcrumb--transparent'
    : variant === 'black'
      ? 'region-breadcrumb--black'
      : '';

  const nav = document.createElement('nav');
  nav.className = 'region-breadcrumb' + (modClass ? ` ${modClass}` : '');
  nav.setAttribute('aria-label', 'Ruta de navegación');

  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'breadcrumb';

  const ul = document.createElement('ul');

  const linkCells = cells.slice(1);
  linkCells.forEach((cell, i) => {
    const li = document.createElement('li');
    const isFirst = i === 0;
    const isLast = i === linkCells.length - 1;
    li.className = [
      isFirst ? 'primero' : '',
      isLast ? 'ultimo current' : '',
    ].filter(Boolean).join(' ');

    // Preservar enlace o texto tal cual llegue de AEM (usar clones para no mover nodos)
    const clones = Array.from(cell.childNodes).map(n => n.cloneNode(true));
    li.append(...clones);
    if (isLast) li.setAttribute('aria-current', 'page');
    ul.append(li);
  });

  breadcrumb.append(ul);
  nav.append(breadcrumb);

  // Añadir la estructura final sin eliminar el contenido original
  block.append(nav);
  block.classList.add('breadcrumb--initialized');
}
