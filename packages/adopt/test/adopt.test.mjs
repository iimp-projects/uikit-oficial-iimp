import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  appendBitacora,
  ensureBitacora,
  findDuplicateBitacoras,
} from "../src/bitacora.mjs";
import { applyConfiguration, dependencyCommands } from "../src/configure.mjs";
import { BASELINE_SKILLS } from "../src/constants.mjs";
import { migrateSafeNativeControls } from "../src/migrate-ui.mjs";
import { analyzeProject, recommendationQueries } from "../src/analyze.mjs";
import {
  installSkills,
  isRelevantSkill,
  missingBaselineSkills,
  parseSkillSearch,
} from "../src/skills.mjs";

async function fixture() {
  const cwd = await mkdtemp(join(tmpdir(), "iimp-adopt-"));
  mkdirSync(join(cwd, "src", "app"), { recursive: true });
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({
      name: "legacy",
      scripts: { build: "next build" },
      dependencies: { next: "15.0.0", react: "19.0.0" },
    }),
  );
  writeFileSync(
    join(cwd, "tsconfig.json"),
    '{\n  // legacy comment\n  "compilerOptions": { "strict": false }\n}\n',
  );
  writeFileSync(
    join(cwd, "src", "app", "page.tsx"),
    "export default function Page() { return <button>Guardar</button> }",
  );
  writeFileSync(join(cwd, "src", "app", "globals.css"), "body {}\n");
  return cwd;
}

test("analiza stack y controles nativos", async () => {
  const cwd = await fixture();
  const result = analyzeProject(cwd);
  assert.equal(result.detected.next, "15.0.0");
  assert.equal(result.nativeUsage[0].replacement, "Button");
});

test("configura strict mode sin borrar comentarios ni scripts", async () => {
  const cwd = await fixture();
  applyConfiguration(cwd);
  const tsconfig = readFileSync(join(cwd, "tsconfig.json"), "utf8");
  const packageJson = JSON.parse(
    readFileSync(join(cwd, "package.json"), "utf8"),
  );
  assert.match(tsconfig, /legacy comment/);
  assert.match(tsconfig, /noUncheckedIndexedAccess/);
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.lint, "eslint . --max-warnings=0");
  assert.equal(
    packageJson.scripts.bitacora,
    "node scripts/append-bitacora.mjs",
  );
  assert.match(
    readFileSync(join(cwd, "AGENTS.md"), "utf8"),
    /Estándar IIMP obligatorio/,
  );
  assert.match(
    readFileSync(join(cwd, "src", "app", "globals.css"), "utf8"),
    /official-uikit-iimp\/theme.css/,
  );
  assert.match(readFileSync(join(cwd, "bitacora.md"), "utf8"), /Bitácora/);
  assert.match(
    readFileSync(join(cwd, "CLAUDE.md"), "utf8"),
    /Contexto IIMP obligatorio/,
  );
  assert.match(
    readFileSync(join(cwd, "GEMINI.md"), "utf8"),
    /Contexto IIMP obligatorio/,
  );
});

test("la bitácora conserva el historial y registra la zona horaria", async () => {
  const cwd = await fixture();
  ensureBitacora(cwd);
  appendBitacora(
    cwd,
    "Validación de la bitácora",
    new Date("2026-10-01T15:30:00Z"),
  );
  const bitacora = readFileSync(join(cwd, "bitacora.md"), "utf8");
  assert.match(bitacora, /Validación de la bitácora/);
  assert.match(bitacora, /America\/Lima/);
});

test("la adopción es idempotente", async () => {
  const cwd = await fixture();
  applyConfiguration(cwd);
  applyConfiguration(cwd);
  const agents = readFileSync(join(cwd, "AGENTS.md"), "utf8");
  assert.equal(agents.match(/iimp-adopt:start/g)?.length, 1);
});

test("conserva un comando de bitácora existente", async () => {
  const cwd = await fixture();
  const packagePath = join(cwd, "package.json");
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  packageJson.scripts.bitacora = "node tools/mi-bitacora.mjs";
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  applyConfiguration(cwd);
  const configured = JSON.parse(readFileSync(packagePath, "utf8"));
  assert.equal(configured.scripts.bitacora, "node tools/mi-bitacora.mjs");
});

test("omite skills ya instaladas", async () => {
  const cwd = await fixture();
  mkdirSync(join(cwd, ".agents", "skills", "caveman"), { recursive: true });
  writeFileSync(
    join(cwd, ".agents", "skills", "caveman", "SKILL.md"),
    "# Caveman",
  );
  const missing = missingBaselineSkills(cwd);
  assert.equal(
    missing.some(({ name }) => name === "caveman"),
    false,
  );
  assert.equal(missing.length, BASELINE_SKILLS.length - 1);
});

test("reconoce una skill instalada para Gemini", async () => {
  const cwd = await fixture();
  mkdirSync(join(cwd, ".gemini", "skills", "caveman"), { recursive: true });
  writeFileSync(
    join(cwd, ".gemini", "skills", "caveman", "SKILL.md"),
    "# Caveman",
  );
  assert.equal(
    missingBaselineSkills(cwd).some(({ name }) => name === "caveman"),
    false,
  );
});

test("interpreta resultados de find-skills y popularidad", () => {
  const parsed = parseSkillSearch(
    "vercel-labs/agent-skills@vercel-react-best-practices 756.6K installs\n",
  );
  assert.deepEqual(parsed, [
    {
      source: "https://github.com/vercel-labs/agent-skills",
      name: "vercel-react-best-practices",
      installs: 756600,
    },
  ]);
});

test("no actualiza Next mayor sin autorización explícita", async () => {
  const cwd = await fixture();
  const analysis = analyzeProject(cwd);
  assert.equal(
    dependencyCommands(analysis).flat().includes("next@latest"),
    false,
  );
  assert.equal(
    dependencyCommands(analysis, { upgradeNext: true })
      .flat()
      .includes("next@latest"),
    true,
  );
});

test("convierte solamente controles HTML seguros", async () => {
  const cwd = await fixture();
  writeFileSync(
    join(cwd, "src", "app", "page.tsx"),
    'export default function Page() { return <><button>Guardar</button><input type="email" /><input type="checkbox" /><hr /></> }',
  );
  const result = migrateSafeNativeControls(cwd);
  const content = readFileSync(join(cwd, "src", "app", "page.tsx"), "utf8");
  assert.equal(result[0].replacements, 3);
  assert.match(
    content,
    /import \{ Button, Input, Separator \} from "official-uikit-iimp"/,
  );
  assert.match(content, /<Button>Guardar<\/Button>/);
  assert.match(content, /<input type="checkbox"/);
});

test("las recomendaciones salen solo de las dependencias del proyecto", () => {
  const queries = recommendationQueries({
    dependencies: { next: "16", react: "19", zod: "4" },
    detected: {},
  });
  assert.deepEqual(
    queries.map(({ query }) => query),
    ["nextjs", "react", "zod"],
  );
  const react = queries.find(({ query }) => query === "react");
  assert.equal(
    isRelevantSkill(
      {
        source: "vercel-labs/agent-skills",
        name: "vercel-react-best-practices",
      },
      react.keywords,
    ),
    true,
  );
  assert.equal(
    isRelevantSkill(
      { source: "microsoft/azure-skills", name: "azure-compliance" },
      react.keywords,
    ),
    false,
  );
});

test("una skill inexistente no aborta la instalación de las demás", () => {
  const calls = [];
  const run = (_command, args) => {
    calls.push(args);
    const names = args.slice(
      args.indexOf("--skill") + 1,
      args.indexOf("--agent"),
    );
    if (names.includes("fantasma")) throw new Error("No matching skills");
  };
  const failed = installSkills(
    "/tmp",
    [
      { source: "https://github.com/a/b", name: "buena" },
      { source: "https://github.com/a/b", name: "fantasma" },
    ],
    run,
  );
  assert.deepEqual(failed, [
    { source: "https://github.com/a/b", name: "fantasma" },
  ]);
  assert.ok(
    calls.some((args) => args.includes("buena") && !args.includes("fantasma")),
  );
});

test("las recomendaciones también leen README y docs del proyecto", () => {
  const queries = recommendationQueries({
    dependencies: { next: "16" },
    docsText: "Usamos Prisma con PostgreSQL y Redis. Nada de nextjs aquí.",
    detected: {},
  });
  assert.deepEqual(
    queries.map(({ query }) => query),
    ["nextjs", "prisma", "postgresql"],
  );
});

test("detecta una segunda bitácora en docs/", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "iimp-bitacora-"));
  ensureBitacora(cwd);
  mkdirSync(join(cwd, "docs"));
  writeFileSync(join(cwd, "docs", "BITACORA.md"), "# otra\n");
  assert.deepEqual(findDuplicateBitacoras(cwd), ["docs/BITACORA.md"]);
});
