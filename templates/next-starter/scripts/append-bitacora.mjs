import { appendFileSync, existsSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const path = join(globalThis.process.cwd(), "bitacora.md")
const template =
  "# Bitácora del proyecto\n\nRegistro cronológico de cambios, decisiones y validaciones.\n\n## Regla de uso\n\n- Leer este archivo antes de continuar.\n- Agregar una entrada por cada avance relevante.\n- No eliminar entradas anteriores.\n\n## Entradas\n\n"
const summary = globalThis.process.argv.slice(2).join(" ").trim()

if (!summary) {
  globalThis.console.error('Uso: npm run bitacora -- "descripción del avance"')
  globalThis.process.exitCode = 1
} else {
  if (!existsSync(path)) writeFileSync(path, template)
  const timestamp = new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Lima",
    hour12: false,
  }).format(new Date())
  appendFileSync(path, `- ${timestamp} America/Lima — ${summary}\n`)
  globalThis.console.log(`Bitácora actualizada: ${path}`)
}
