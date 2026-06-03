/**
 * deploy.js — Script de Despliegue Manual via AEM Admin API
 * Para uso desde la línea de comandos cuando se necesita más control que los workflows.
 *
 * Uso:
 *   node scripts/deploy.js --preview /es/inicio
 *   node scripts/deploy.js --publish /es/inicio
 *   node scripts/deploy.js --publish /*  (publica todo)
 *   node scripts/deploy.js --status /es/inicio
 *
 * Generado por SA-D08 del Sprint 2 — Red Agéntica AEM
 */

import 'dotenv/config';
import fetch from 'node-fetch';

// Validar variables de entorno requeridas
const required = ['AEM_ADMIN_TOKEN', 'AEM_EDS_ORG', 'AEM_EDS_SITE'];
for (const varName of required) {
  if (!process.env[varName]) {
    console.error(`[DEPLOY] ERROR: Variable de entorno ${varName} no configurada`);
    process.exit(1);
  }
}

const { AEM_ADMIN_TOKEN, AEM_EDS_ORG, AEM_EDS_SITE } = process.env;
const BASE_URL = `https://admin.hlx.page`;
const BRANCH = 'main';

/**
 * Realiza una operación en la Admin API de AEM EDS.
 * @param {'preview'|'live'|'status'} type - Tipo de operación
 * @param {string} pagePath - Ruta de la página (ej: /es/inicio)
 */
async function adminOperation(type, pagePath) {
  const url = `${BASE_URL}/${type}/${AEM_EDS_ORG}/${AEM_EDS_SITE}/${BRANCH}${pagePath}`;
  const method = type === 'status' ? 'GET' : 'POST';

  console.log(`[DEPLOY] ${method} ${url}`);

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `token ${AEM_ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`[DEPLOY] ERROR: HTTP ${response.status} — ${JSON.stringify(data)}`);
    return { ok: false, status: response.status, data };
  }

  console.log(`[DEPLOY] ✓ HTTP ${response.status} — Operación completada`);
  return { ok: true, status: response.status, data };
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const operation = args[0]; // --preview, --publish, --status
const pagePath = args[1] || '/';

if (!['--preview', '--publish', '--status'].includes(operation)) {
  console.error('[DEPLOY] Uso: node scripts/deploy.js --preview|--publish|--status /ruta');
  process.exit(1);
}

const typeMap = { '--preview': 'preview', '--publish': 'live', '--status': 'status' };
const result = await adminOperation(typeMap[operation], pagePath);

if (!result.ok) process.exit(1);
