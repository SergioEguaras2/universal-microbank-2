/**
 * analytics.js — Bloque de Eventos de Analítica
 * Implementa los eventos custom detectados en Discovery (SA-8).
 * Es un bloque invisible — solo registra eventos de interacción.
 *
 * Generado por SA-D06 del Sprint 2 — Red Agéntica AEM
 */

/**
 * @param {HTMLElement} block - Elemento raíz del bloque (oculto en el DOM)
 */
export default function decorate(block) {
  // Ocultar el bloque — es un bloque de comportamiento, no visual
  block.style.display = 'none';
  block.setAttribute('aria-hidden', 'true');

  // Esperar a que dataLayer esté disponible
  window.dataLayer = window.dataLayer || [];

  // Sin eventos custom detectados en Discovery
  // Implementación base: tracking de clics en CTAs
  document.addEventListener('click', (ev) => {
    const cta = ev.target.closest('a[href], button');
    if (!cta) return;
    const isExternal = cta.href && !cta.href.includes(window.location.hostname);
    if (isExternal) {
      window.dataLayer.push({
        event: 'outbound_link',
        link_url: cta.href,
        link_text: cta.textContent?.trim()?.slice(0, 100),
      });
    }
  }, { passive: true });

  // Tracking de scroll depth
  let maxScroll = 0;
  const milestones = [25, 50, 75, 100];
  window.addEventListener('scroll', () => {
    const scrollPct = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    for (const milestone of milestones) {
      if (scrollPct >= milestone && maxScroll < milestone) {
        maxScroll = milestone;
        window.dataLayer.push({
          event: 'scroll_depth',
          depth: `${milestone}%`,
          page: window.location.pathname,
        });
      }
    }
  }, { passive: true });
}
