/**
 * pagination.js — Bloque AEM EDS: Pagination
 * CSS BEM: .blog-pagination, .blog-pagination__list, .pagination__item[.active],
 *          .pagination__button (prev/next)
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = página actual, celda 1 = total páginas, celda 2 = URL base
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [cell0, cell1, cell2] = [...(rows[0]?.querySelectorAll(':scope > div') ?? [])];

  const currentPage = parseInt(cell0?.textContent.trim(), 10) || 1;
  const totalPages = parseInt(cell1?.textContent.trim(), 10) || 1;
  const baseUrl = cell2?.textContent.trim() || '#';

  const nav = document.createElement('nav');
  nav.className = 'blog-pagination';
  nav.setAttribute('aria-label', 'Paginación');

  // Botón anterior
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination__button pagination__button--prev';
  prevBtn.setAttribute('aria-label', 'Página anterior');
  prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
  prevBtn.disabled = currentPage <= 1;

  // Lista de páginas
  const list = document.createElement('ul');
  list.className = 'blog-pagination__list';
  list.setAttribute('role', 'list');

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let p = start; p <= end; p++) {
    const li = document.createElement('li');
    li.className = 'pagination__item' + (p === currentPage ? ' active' : '');
    if (p === currentPage) li.setAttribute('aria-current', 'page');

    const btn = document.createElement('button');
    btn.className = 'pagination__page-btn';
    btn.textContent = String(p);
    btn.setAttribute('aria-label', `Página ${p}`);
    btn.addEventListener('click', () => {
      window.location.href = p === 1 ? baseUrl : `${baseUrl.replace(/\/$/, '')}/page-${p}`;
    });
    li.append(btn);
    list.append(li);
  }

  // Botón siguiente
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination__button pagination__button--next';
  nextBtn.setAttribute('aria-label', 'Página siguiente');
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
  nextBtn.disabled = currentPage >= totalPages;

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) window.location.href = currentPage === 2 ? baseUrl : `${baseUrl.replace(/\/$/, '')}/page-${currentPage - 1}`;
  });
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) window.location.href = `${baseUrl.replace(/\/$/, '')}/page-${currentPage + 1}`;
  });

  nav.append(prevBtn, list, nextBtn);
  // No eliminar filas originales: mantener contenido existente y añadir navegación
  block.append(nav);
  block.classList.add('pagination--initialized');
}
