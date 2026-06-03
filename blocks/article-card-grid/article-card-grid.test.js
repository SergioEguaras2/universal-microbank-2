/**
 * article-card-grid.test.js — Tests Unitarios del Bloque ArticleCardGrid
 * Framework: vitest
 *
 * Generado por SA-D03 del Sprint 2 — Red Agéntica AEM
 * Ejecutar: npx vitest run blocks/article-card-grid/article-card-grid.test.js
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Setup del entorno DOM ────────────────────────────────────────────────────
// vitest usa jsdom por defecto (@vitest/browser o jsdom en vitest.config.js)
// Configurar en vitest.config.js: { test: { environment: 'jsdom' } }

/**
 * Crea un bloque article-card-grid mínimo para tests.
 * @returns {HTMLElement} Elemento bloque simulado
 */
function createBlock(innerHTML = '<div><div>Contenido de prueba</div></div>') {
  const block = document.createElement('div');
  block.classList.add('article-card-grid');
  block.innerHTML = innerHTML;
  document.body.appendChild(block);
  return block;
}

/**
 * Limpia el DOM después de cada test.
 */
function cleanupBlock(block) {
  if (block && block.parentNode) block.parentNode.removeChild(block);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ArticleCardGrid Block', () => {
  let block;

  beforeEach(() => {
    block = createBlock();
  });

  // Limpiar DOM después de cada test
  afterEach(() => {
    cleanupBlock(block);
    vi.clearAllMocks();
  });

  // ── Test 1: Importación y renderizado básico ──────────────────────────────
  it('importa y ejecuta decorate() sin errores', async () => {
    const mod = await import('./article-card-grid.js');
    expect(mod.default).toBeTypeOf('function');
    expect(() => mod.default(block)).not.toThrow();
  });

  // ── Test 2: Clase de inicialización ──────────────────────────────────────
  it('añade la clase de inicialización al bloque', async () => {
    const { default: decorate } = await import('./article-card-grid.js');
    decorate(block);
    expect(block.classList.contains('article-card-grid--initialized')).toBe(true);
  });

  // ── Test 3: Tolerancia a DOM vacío ───────────────────────────────────────
  it('no lanza errores con un bloque vacío', async () => {
    const { default: decorate } = await import('./article-card-grid.js');
    const emptyBlock = document.createElement('div');
    emptyBlock.classList.add('article-card-grid');
    expect(() => decorate(emptyBlock)).not.toThrow();
  });

  // ── Test 4: Tolerancia a null/undefined ──────────────────────────────────
  it('no lanza errores si block es null', async () => {
    const { default: decorate } = await import('./article-card-grid.js');
    expect(() => decorate(null)).not.toThrow();
    expect(() => decorate(undefined)).not.toThrow();
  });

  // ── Test 5: Estructura del DOM después de decorate() ─────────────────────
  it('mantiene el contenido original del bloque', async () => {
    const { default: decorate } = await import('./article-card-grid.js');
    const originalText = block.textContent;
    decorate(block);
    // El bloque puede añadir elementos pero no debe eliminar contenido original
    expect(block.textContent).toContain('Contenido de prueba');
  });

  // ── Test 6: Idempotencia ──────────────────────────────────────────────────
  it('es idempotente: llamar decorate() dos veces no produce errores', async () => {
    const { default: decorate } = await import('./article-card-grid.js');
    expect(() => {
      decorate(block);
      decorate(block);
    }).not.toThrow();
  });
});
