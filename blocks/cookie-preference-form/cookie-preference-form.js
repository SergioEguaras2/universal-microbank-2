/**
 * cookie-preference-form.js — Bloque AEM EDS: CookiePreferenceForm
 * CSS BEM: form.capaCookies, .tb-text, .tb-text-r, .tb-text-c, .tb-save,
 *          .buttons_group, .button_wrap, .custom-form-checkbox
 *
 * Entrada AEM:
 *   Cada fila = una categoría de cookie. Celda 0 = nombre, celda 1 = descripción, celda 2 = toggle
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];

  const form = document.createElement('form');
  form.className = 'capaCookies';
  form.id = 'capaCookies';
  form.setAttribute('method', 'POST');
  form.setAttribute('novalidate', '');

  const table = document.createElement('div');
  table.className = 'tb-text';

  rows.forEach((row, i) => {
    const [nameCell, descCell, toggleCell] = [...row.querySelectorAll(':scope > div')];
    const rowId = `cookie-cat-${i}`;

    const tbRow = document.createElement('div');
    tbRow.className = 'tb-text-r';

    const cell = document.createElement('div');
    cell.className = 'tb-text-c';

    // Nombre de la categoría
    const label = document.createElement('p');
    label.textContent = nameCell?.textContent.trim() ?? '';
    cell.append(label);

    // Descripción expandible
    if (descCell) {
      const descWrap = document.createElement('div');
      descWrap.className = 'tb-text-c tb-text-down';
      descWrap.append(...descCell.childNodes);
      cell.append(descWrap);
    }

    // Toggle (checkbox)
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    const isRequired = toggleCell?.textContent.trim().toLowerCase() === 'required';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = rowId;
    cb.name = rowId;
    cb.className = 'custom-form-checkbox';
    if (isRequired) { cb.checked = true; cb.disabled = true; }

    // Comportamiento visual del checkbox personalizado
    cb.addEventListener('change', () => {
      cb.classList.toggle('custom-form-checked', cb.checked);
    });

    inputGroup.append(cb, Object.assign(document.createElement('label'), { htmlFor: rowId, textContent: nameCell?.textContent.trim() ?? '' }));
    cell.append(inputGroup);

    tbRow.append(cell);
    table.append(tbRow);
  });

  // Botones guardar / rechazar todo
  const save = document.createElement('div');
  save.className = 'tb-save';

  const btnGroup = document.createElement('div');
  btnGroup.className = 'buttons_group doble_button';

  const makeBtn = (text, cls, type = 'button') => {
    const wrap = document.createElement('div');
    wrap.className = 'button_wrap';
    const btn = document.createElement('button');
    btn.type = type;
    btn.className = `btn ${cls}`;
    btn.textContent = text;
    wrap.append(btn);
    return wrap;
  };

  btnGroup.append(
    makeBtn('Guardar preferencias', 'btn-primary', 'submit'),
    makeBtn('Rechazar todas', 'btn-secondary'),
  );
  save.append(btnGroup);

  form.append(table, save);
  rows.forEach(r => r.remove());
  block.append(form);
  block.classList.add('cookie-preference-form--initialized');
}
