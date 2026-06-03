/**
 * nav-main.js — Bloque AEM EDS: NavMain
 * CSS BEM: .navbar.navbar-expand-lg, .navbar-toggler, .navbar-collapse,
 *          .navbar-nav, .nav-item, .nav-link[.active]
 *
 * Entrada AEM:
 *   Cada fila = un item de nav. Celda 0 = texto del enlace, celda 1 = URL, celda 2 = subitems (separados por |)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg';
  nav.setAttribute('aria-label', 'Navegación principal');

  // Botón hamburguesa (móvil)
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'navbar-toggler collapsed';
  toggleBtn.setAttribute('type', 'button');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-label', 'Abrir menú');
  toggleBtn.setAttribute('aria-controls', 'main-navbar');
  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'navbar-toggler-icon';
  toggleIcon.setAttribute('aria-hidden', 'true');
  toggleBtn.append(toggleIcon);

  // Collapse wrap
  const collapse = document.createElement('div');
  collapse.className = 'navbar-collapse collapse';
  collapse.id = 'main-navbar';

  const ul = document.createElement('ul');
  ul.className = 'navbar-nav';

  rows.forEach((row) => {
    const [labelCell, urlCell, subCell] = [...row.querySelectorAll(':scope > div')];
    const href = urlCell?.querySelector('a')?.href || urlCell?.textContent.trim() || '#';
    const label = labelCell?.textContent.trim() ?? '';
    const isActive = window.location.pathname === new URL(href, window.location.origin).pathname;

    const li = document.createElement('li');
    li.className = 'nav-item' + (isActive ? ' active' : '');

    const a = document.createElement('a');
    a.className = 'nav-link' + (isActive ? ' active' : '');
    a.href = href;
    a.textContent = label;
    if (isActive) a.setAttribute('aria-current', 'page');

    li.append(a);

    // Subitems (megamenú)
    if (subCell?.textContent.trim()) {
      li.classList.add('nav-item--has-submenu');
      const subLabels = subCell.textContent.split('|').map(s => s.trim()).filter(Boolean);
      const submenu = document.createElement('ul');
      submenu.className = 'nav-submenu';
      subLabels.forEach((sub) => {
        const subLi = document.createElement('li');
        subLi.className = 'nav-submenu__item';
        subLi.textContent = sub;
        submenu.append(subLi);
      });
      li.append(submenu);
    }

    ul.append(li);
    row.remove();
  });

  // Toggle mobile
  toggleBtn.addEventListener('click', () => {
    const open = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!open));
    toggleBtn.classList.toggle('collapsed', open);
    collapse.classList.toggle('show', !open);
  });

  collapse.append(ul);
  nav.append(toggleBtn, collapse);
  block.append(nav);
  block.classList.add('nav-main--initialized');
}
