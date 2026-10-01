import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const BITACORA_FILE = "bitacora.md";

export const BITACORA_TEMPLATE = `# Bitácora del proyecto

Registro cronológico de cambios, decisiones y validaciones.

## Regla de uso

- Antes de empezar, leer este archivo para conservar el contexto.
- Al terminar cada avance relevante, agregar una entrada con fecha, hora, qué cambió y cómo se validó.
- No eliminar entradas anteriores; si algo se revierte, registrar también la reversión.

## Entradas

`;

function timestamp(now) {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Lima",
    hour12: false,
  }).format(now);
}

export function ensureBitacora(cwd) {
  const path = join(cwd, BITACORA_FILE);
  if (!existsSync(path)) writeFileSync(path, BITACORA_TEMPLATE);
  return path;
}

export function appendBitacora(cwd, summary, now = new Date()) {
  const path = ensureBitacora(cwd);
  appendFileSync(path, `- ${timestamp(now)} America/Lima — ${summary}\n`);
  return path;
}
