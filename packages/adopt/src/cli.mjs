import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { analyzeProject } from "./analyze.mjs";
import {
  applyConfiguration,
  dependencyCommands,
  runDependencyCommands,
} from "./configure.mjs";
import { migrateSafeNativeControls } from "./migrate-ui.mjs";
import { formatReport, writeReport } from "./report.mjs";
import {
  discoverRecommendedSkills,
  installSkills,
  missingBaselineSkills,
  selectRecommendedSkills,
} from "./skills.mjs";
import { appendBitacora } from "./bitacora.mjs";

function help() {
  console.log(
    `@nrivera-iimp/adopt — adopta el estándar oficial IIMP\n\nUso:\n  npx @nrivera-iimp/adopt@latest [opciones]\n\nOpciones:\n  --dry-run              analiza sin modificar\n  --yes                  aplica sin confirmación\n  --cwd <ruta>           proyecto a analizar\n  --skills-only          instala skills sin tocar configuración\n  --skip-skills          no instala skills base\n  --skip-deps            no instala dependencias npm\n  --fix-safe             convierte controles HTML inequívocos\n  --recommend-skills     busca recomendaciones al terminar\n  --no-recommend-skills  omite recomendaciones\n  --upgrade-next         actualiza Next/React explícitamente\n  --help                 muestra esta ayuda\n`,
  );
}

export function parseArguments(args) {
  const options = {
    cwd: process.cwd(),
    dryRun: false,
    yes: false,
    skillsOnly: false,
    skipSkills: false,
    skipDeps: false,
    recommendSkills: true,
    upgradeNext: false,
    fixSafe: false,
    help: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--cwd") options.cwd = resolve(args[++index] ?? ".");
    else if (argument === "--dry-run") options.dryRun = true;
    else if (argument === "--yes" || argument === "-y") options.yes = true;
    else if (argument === "--skills-only") options.skillsOnly = true;
    else if (argument === "--skip-skills") options.skipSkills = true;
    else if (argument === "--skip-deps") options.skipDeps = true;
    else if (argument === "--recommend-skills") options.recommendSkills = true;
    else if (argument === "--no-recommend-skills")
      options.recommendSkills = false;
    else if (argument === "--upgrade-next") options.upgradeNext = true;
    else if (argument === "--fix-safe") options.fixSafe = true;
    else if (argument === "--help" || argument === "-h") options.help = true;
    else throw new Error(`Opción desconocida: ${argument}`);
  }
  return options;
}

async function confirmApply() {
  if (!process.stdin.isTTY) return false;
  const { createInterface } = await import("node:readline/promises");
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = (await readline.question("\n¿Aplicar estos cambios? [y/N] "))
    .trim()
    .toLowerCase();
  readline.close();
  return (
    answer === "y" ||
    answer === "yes" ||
    answer === "s" ||
    answer === "si" ||
    answer === "sí"
  );
}

export async function runCli(args) {
  const options = parseArguments(args);
  if (options.help) {
    help();
    return;
  }
  if (!existsSync(options.cwd))
    throw new Error(`La ruta no existe: ${options.cwd}`);

  const analysis = analyzeProject(options.cwd);
  const missingSkills = options.skipSkills
    ? []
    : missingBaselineSkills(options.cwd);
  const commands = dependencyCommands(analysis, {
    upgradeNext: options.upgradeNext,
  });
  const report = formatReport(analysis, missingSkills, commands);
  console.log(report);

  if (options.dryRun) {
    console.log("Dry-run completo: no se modificó ningún archivo.");
    return;
  }
  if (!options.yes && !(await confirmApply())) {
    console.log("Operación cancelada sin cambios.");
    return;
  }

  if (!options.skillsOnly) {
    if (!options.skipDeps) runDependencyCommands(commands, options.cwd);
    applyConfiguration(options.cwd);
    if (options.fixSafe) {
      const migrations = migrateSafeNativeControls(options.cwd);
      const replacements = migrations.reduce(
        (total, migration) => total + migration.replacements,
        0,
      );
      console.log(`Migración UI segura: ${replacements} reemplazos.`);
    }
  }
  if (!options.skipSkills && missingSkills.length)
    installSkills(options.cwd, missingSkills);
  const reportPath = writeReport(options.cwd, report);

  if (options.recommendSkills) {
    const recommendations = discoverRecommendedSkills(options.cwd, analysis);
    const selected = await selectRecommendedSkills(recommendations);
    if (selected.length) installSkills(options.cwd, selected);
  }

  appendBitacora(
    options.cwd,
    options.skillsOnly
      ? "Skills IIMP instaladas o verificadas mediante el CLI de adopción."
      : "Estándar IIMP aplicado mediante el CLI de adopción; revisar .iimp/ADOPTION_REPORT.md.",
  );

  console.log(`\nAdopción IIMP aplicada. Reporte: ${reportPath}`);
  console.log("Siguiente paso: npm run check");
}
