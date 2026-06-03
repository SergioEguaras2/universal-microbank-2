/**
 * page-tabs.js — Bloque AEM EDS: PageTabs
 * CSS BEM: .nav.nav-tabs, .nav-item, .nav-link[.active], .tab-content, .tab-pane[.active]
 *
 * Entrada AEM:
 *   Fila 0: cada celda = label de un tab
 *   Filas 1..N: contenido de cada tab (en orden)
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [labelRow, ...contentRows] = rows;
  const labels = [...(labelRow?.querySelectorAll(':scope > div') ?? [])];

  const blockName = block.dataset.blockName || 'page-tabs';

  const nav = document.createElement('ul');
  nav.className = 'nav nav-tabs';
  nav.setAttribute('role', 'tablist');

  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  labels.forEach((lbl, i) => {
    const tabId = `tab-${blockName}-${i}`;
    const panelId = `panel-${tabId}`;

    const li = document.createElement('li');
    li.className = 'nav-item';
    li.setAttribute('role', 'presentation');

    const btn = document.createElement('button');
    btn.className = 'nav-link' + (i === 0 ? ' active' : '');
    btn.id = tabId;
    btn.setAttribute('type', 'button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', panelId);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = lbl.textContent.trim();
    li.append(btn);
    nav.append(li);

    const pane = document.createElement('div');
    pane.className = 'tab-pane' + (i === 0 ? ' active' : '');
    pane.id = panelId;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', tabId);
    pane.setAttribute('tabindex', '0');
    if (contentRows[i]) pane.append(...contentRows[i].querySelectorAll(':scope > div'));
    tabContent.append(pane);

    btn.addEventListener('click', () => {
      nav.querySelectorAll('.nav-link').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContent.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      pane.classList.add('active');
    });
  });

  contentRows.forEach(r => r.remove());
  labelRow?.replaceWith(nav);
  block.append(tabContent);
  block.classList.add('page-tabs--initialized');
}
