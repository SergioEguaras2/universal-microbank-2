/**
 * search-results.js — Bloque AEM EDS: SearchResults
 * CSS BEM: .search-results, .main-article, .static-html
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = query de búsqueda (text input), celda 1 = placeholder
 *   Filas 1..N: resultados (celda 0 = título, celda 1 = URL, celda 2 = descripción)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [configRow, ...resultRows] = rows;
  const [queryCell, placeholderCell] = [...(configRow?.querySelectorAll(':scope > div') ?? [])];

  const article = document.createElement('article');
  article.className = 'main-article search-results__article';

  // Input de búsqueda
  const searchForm = document.createElement('form');
  searchForm.className = 'search-results__form';
  searchForm.setAttribute('role', 'search');

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.className = 'search-results__input';
  searchInput.placeholder = placeholderCell?.textContent.trim() || 'Buscar...';
  searchInput.setAttribute('aria-label', 'Búsqueda');
  if (queryCell) searchInput.value = queryCell.textContent.trim();

  const searchBtn = document.createElement('button');
  searchBtn.type = 'submit';
  searchBtn.className = 'search-results__submit';
  searchBtn.textContent = 'Buscar';

  searchForm.append(searchInput, searchBtn);
  article.append(searchForm);

  // Lista de resultados
  if (resultRows.length) {
    const resultsList = document.createElement('ul');
    resultsList.className = 'search-results__list';

    resultRows.forEach((row) => {
      const [titleCell, urlCell, descCell] = [...row.querySelectorAll(':scope > div')];
      const href = urlCell?.querySelector('a')?.href || urlCell?.textContent.trim() || '#';

      const li = document.createElement('li');
      li.className = 'search-results__item';

      const a = document.createElement('a');
      a.href = href;
      a.className = 'search-results__item-link';
      a.textContent = titleCell?.textContent.trim() ?? '';
      li.append(a);

      if (urlCell) {
        const url = document.createElement('span');
        url.className = 'search-results__item-url';
        url.textContent = href;
        li.append(url);
      }

      if (descCell) {
        const desc = document.createElement('p');
        desc.className = 'search-results__item-desc';
        desc.textContent = descCell.textContent.trim();
        li.append(desc);
      }

      resultsList.append(li);
    });

    article.append(resultsList);
  } else {
    const empty = document.createElement('p');
    empty.className = 'search-results__empty';
    empty.textContent = 'No se encontraron resultados.';
    article.append(empty);
  }

  // Mantener filas originales (no eliminar configRow) y añadir el article
  block.append(article);
  block.classList.add('search-results--initialized');
}
