/**
 * tabs-nested.js — Bloque AEM EDS: TabsNested
 * CSS BEM: .nav.nav-tabs, .nav-item, .nav-link[.active], .tab-content, .tab-pane[.active]
 * Igual que page-tabs pero permite tabs anidados en cada panel.
 *
 * Entrada AEM:
 *   Fila 0: cada celda = label de un tab de primer nivel
 *   Filas impares: labels de tabs anidados del nivel anterior
 *   Filas pares: contenido del tab anidado correspondiente
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [labelRow, ...rest] = rows;
  const labels = [...(labelRow?.querySelectorAll(':scope > div') ?? [])];

  const nav = document.createElement('ul');
  nav.className = 'nav nav-tabs tabs-nested__nav';
  nav.setAttribute('role', 'tablist');

  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content tabs-nested__content';

  labels.forEach((lbl, i) => {
    const tabId = `tabs-nested-${i}`;
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
    pane.className = 'tab-pane tabs-nested__pane' + (i === 0 ? ' active' : '');
    pane.id = panelId;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', tabId);
    pane.setAttribute('tabindex', '0');

    // Contenido del panel: las filas alternantes son los contenidos
    const contentRow = rest[i];
    if (contentRow) {
      pane.append(...contentRow.querySelectorAll(':scope > div'));
      contentRow.remove();
    }
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

  labelRow?.replaceWith(nav);
  block.append(tabContent);
  block.classList.add('tabs-nested--initialized');
}
