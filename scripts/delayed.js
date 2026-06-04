/**
 * delayed.js — Scripts de Carga Diferida
 * Se ejecuta ~3 segundos después de la carga inicial para no penalizar CWV.
 * La analítica (GTM/GA4) se inyecta aquí por SA-D06.
 *
 * Generado por SA-D01 del Sprint 2 — Red Agéntica AEM
 */


// ─── Google Analytics 4 ─────────────────────────────────────────────────────
// Detectado en Discovery (SA-8). Measurement ID: Ver configuración en TMS
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=Ver configuración en TMS';
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'Ver configuración en TMS', {
  page_path: window.location.pathname,
  send_page_view: true,
});
// ─────────────────────────────────────────────────────────────────────────────


console.log('[AEM] Scripts diferidos cargados');
