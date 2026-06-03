/**
 * cookie-consent.js — Bloque AEM EDS: CookieConsent
 * CSS BEM: .button_wrap, .btn, .btn-blue, .btn-secondary, .cookie-consent
 *
 * Entrada AEM:
 *   Fila 0: celda 0 = texto del aviso de cookies, celda 1 = texto botón aceptar, celda 2 = texto botón rechazar
 */
export default function decorate(block) {
  if (!block) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const [textCell, acceptCell, rejectCell] = [...(rows[0]?.querySelectorAll(':scope > div') ?? [])];

  // Comprobar si ya se aceptó
  if (document.cookie.includes('cookie-consent=accepted') || document.cookie.includes('cookie-consent=rejected')) {
    block.remove();
    return;
  }

  const banner = document.createElement('div');
  banner.className = 'cookie-consent__banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Aviso de cookies');

  const textWrap = document.createElement('div');
  textWrap.className = 'cookie-form-text';
  if (textCell) textWrap.append(...textCell.childNodes);

  const btns = document.createElement('div');
  btns.className = 'buttons_group';

  const makeBtn = (cell, cls, cookieVal) => {
    const wrap = document.createElement('div');
    wrap.className = 'button_wrap';
    const btn = document.createElement('button');
    btn.className = `btn ${cls}`;
    btn.setAttribute('type', 'button');
    btn.textContent = cell?.textContent.trim() || (cookieVal === 'accepted' ? 'Aceptar' : 'Rechazar');
    btn.addEventListener('click', () => {
      document.cookie = `cookie-consent=${cookieVal};path=/;max-age=${60 * 60 * 24 * 365}`;
      banner.setAttribute('aria-hidden', 'true');
      banner.style.display = 'none';
    });
    wrap.append(btn);
    return wrap;
  };

  btns.append(
    makeBtn(acceptCell, 'btn-blue', 'accepted'),
    makeBtn(rejectCell, 'btn-secondary', 'rejected'),
  );

  banner.append(textWrap, btns);
  rows.forEach(r => r.remove());
  block.append(banner);
  block.classList.add('cookie-consent--initialized');
}
