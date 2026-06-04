/**
 * custom-test-card.js — Bloque AEM EDS (Generado desde plantilla HTML)
 */
export default function decorate(block) {
  block.classList.add('custom-test-card--initialized');

  // Guardamos los datos de celdas originales del documento AEM
  const cells = [...block.querySelectorAll(':scope > div > div')];
  
  // Plantilla HTML del componente original:
  const template = `
<div class="test-card">
  <h3>Hello World from Custom Component</h3>
  <p>Description text</p>
</div>
  `;

  // Limpiamos el bloque y cargamos la estructura HTML estructurada
  block.innerHTML = template;
  
  // Opcional: Re-mapear el contenido del autor a los elementos correspondientes
  // Ej: block.querySelector('.card-title').textContent = cells[0]?.textContent || '';
}
