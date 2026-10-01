import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function formatReport(analysis, missingSkills, commands) {
  const nativeRows = analysis.nativeUsage.length
    ? analysis.nativeUsage
        .map(
          ({ file, tag, replacement, count }) =>
            `| \`${file}\` | \`<${tag}>\` | ${count} | ${replacement} |`,
        )
        .join("\n")
    : "| — | — | 0 | No se detectaron controles nativos |";
  const commandLines = commands
    .map((parts) => `- \`${parts.join(" ")}\``)
    .join("\n");
  return `# IIMP Adoption Report\n\nGenerado por \`@nrivera-iimp/adopt\`. Este reporte no reemplaza una revisión funcional.\n\n## Proyecto detectado\n\n- Package manager: **${analysis.packageManager}**\n- Next.js: **${analysis.detected.next ?? "no detectado"}**\n- React: **${analysis.detected.react ?? "no detectado"}**\n- TypeScript: **${analysis.detected.typescript ?? "no detectado"}**\n- Tailwind: **${analysis.detected.tailwind ?? "no detectado"}**\n\n## Dependencias propuestas\n\n${commandLines}\n\n## Skills faltantes\n\n${missingSkills.length ? missingSkills.map(({ name, source }) => `- ${name} — ${source}`).join("\n") : "Todas las skills base ya estaban instaladas."}\n\n## HTML nativo a revisar\n\n| Archivo | Tag | Cantidad | Reemplazo oficial |\n|---|---:|---:|---|\n${nativeRows}\n\n## Política\n\n- Las conversiones visuales no deben modificar lógica, routing, permisos, estado ni side effects.\n- Ejecutar \`npm run check\` antes de considerar terminada la adopción.\n- Los casos complejos se migran manualmente; el linter indica el componente oficial esperado.\n`;
}

export function writeReport(cwd, content) {
  const path = join(cwd, ".iimp", "ADOPTION_REPORT.md");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
}
