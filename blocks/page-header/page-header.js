/**
 * page-header.js — Bloque AEM EDS: PageHeader
 * CSS BEM: .product-spacing, .page-header
 * Cabecera de página de producto con imagen de fondo, H1 y subtítulo.
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = imagen de fondo, celda 1 = título + subtítulo
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [imgCell, textCell] = [...(rows[0]?.querySelectorAll(':scope > div') ?? [])];

  // Imagen de fondo
  const img = imgCell?.querySelector('img');
  if (img) {
    block.style.backgroundImage = `url('${img.src}')`;
    block.style.backgroundSize = 'cover';
    block.style.backgroundPosition = 'center';
  }

  const inner = document.createElement('div');
  inner.className = 'page-header__inner product-spacing';

  if (textCell) {
    const clones = Array.from(textCell.childNodes).map(n => n.cloneNode(true));
    inner.append(...clones);
  }

  // Añadir la estructura sin eliminar el contenido original
  block.append(inner);
  block.classList.add('page-header--initialized');
}
