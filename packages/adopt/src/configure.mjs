import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { applyEdits, modify, parse } from "jsonc-parser";
import { STRICT_COMPILER_OPTIONS, UI_KIT_VERSION } from "./constants.mjs";
import { ensureBitacora } from "./bitacora.mjs";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function updateJsonc(path, updates) {
  let content = existsSync(path) ? readFileSync(path, "utf8") : "{}\n";
  for (const [jsonPath, value] of updates) {
    content = applyEdits(
      content,
      modify(content, jsonPath, value, {
        formattingOptions: { insertSpaces: true, tabSize: 2, eol: "\n" },
      }),
    );
  }
  write(path, content.endsWith("\n") ? content : `${content}\n`);
}

export function dependencyCommands(analysis, { upgradeNext = false } = {}) {
  const manager = analysis.packageManager;
  const add =
    manager === "npm"
      ? ["npm", "install"]
      : manager === "yarn"
        ? ["yarn", "add"]
        : [manager, "add"];
  const devFlag = manager === "npm" ? "--save-dev" : "--dev";
  const runtime = [`official-uikit-iimp@${UI_KIT_VERSION}`];
  const development = [
    "typescript@^5",
    "eslint@^9",
    "prettier@^3",
    "tailwindcss@^4",
    "@tailwindcss/postcss@^4",
    "postcss@^8",
    "vitest@^3",
    "@playwright/test@^1",
  ];
  if (!analysis.detected.next || upgradeNext) {
    runtime.push("next@latest", "react@latest", "react-dom@latest");
    development.push("@types/react@latest", "@types/react-dom@latest");
  }
  return [
    [...add, ...runtime],
    [...add, devFlag, ...development],
  ];
}

export function runDependencyCommands(commands, cwd) {
  for (const [command, ...args] of commands) {
    execFileSync(command, args, { cwd, stdio: "inherit" });
  }
}

function configurePackageJson(cwd) {
  const path = join(cwd, "package.json");
  if (!existsSync(path))
    throw new Error(
      "No se encontró package.json. Ejecuta el comando en la raíz del proyecto.",
    );
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  parsed.scripts = {
    ...(parsed.scripts ?? {}),
    lint: "eslint . --max-warnings=0",
    typecheck: "tsc --noEmit",
    prebuild: "npm run typecheck && npm run lint && npm run security:verify",
    predev:
      parsed.scripts?.predev ?? "node scripts/security-gate.mjs verify --warn",
    "security:audit": "node scripts/security-gate.mjs audit",
    "security:verify": "node scripts/security-gate.mjs verify",
    "format:check": "prettier --check .",
    test: parsed.scripts?.test ?? "vitest run --passWithNoTests",
    check:
      "npm run format:check && npm run typecheck && npm run lint && npm run test && npm run build",
    bitacora: parsed.scripts?.bitacora ?? "node scripts/append-bitacora.mjs",
    "skills:recommend": "iimp-adopt --skills-only --recommend-skills",
  };
  write(path, `${JSON.stringify(parsed, null, 2)}\n`);
}

function configureSecurityGate(cwd) {
  const target = join(cwd, "scripts", "security-gate.mjs");
  if (!existsSync(target))
    write(
      target,
      readFileSync(
        join(
          dirname(fileURLToPath(import.meta.url)),
          "..",
          "templates",
          "security-gate.mjs",
        ),
        "utf8",
      ),
    );
  const ignore = join(cwd, ".prettierignore");
  const current = existsSync(ignore) ? readFileSync(ignore, "utf8") : "";
  if (!current.includes(".security/"))
    write(ignore, `${current.trimEnd()}\n.security/\n`.trimStart());
}

function configureTsconfig(cwd) {
  const path = join(cwd, "tsconfig.json");
  const current = existsSync(path) ? parse(readFileSync(path, "utf8")) : {};
  const previousExtends = current?.extends;
  const strictExtends = "official-uikit-iimp/tsconfig/next-strict.json";
  let nextExtends = strictExtends;
  if (typeof previousExtends === "string" && previousExtends !== strictExtends)
    nextExtends = [previousExtends, strictExtends];
  if (
    Array.isArray(previousExtends) &&
    !previousExtends.includes(strictExtends)
  )
    nextExtends = [...previousExtends, strictExtends];

  const updates = [[["extends"], nextExtends]];
  for (const [name, value] of Object.entries(STRICT_COMPILER_OPTIONS)) {
    updates.push([["compilerOptions", name], value]);
  }
  updates.push([
    ["include"],
    ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  ]);
  updates.push([["exclude"], ["node_modules"]]);
  updateJsonc(path, updates);
}

function configureEslint(cwd) {
  const candidates = [
    "eslint.config.mjs",
    "eslint.config.js",
    "eslint.config.cjs",
  ];
  const currentName = candidates.find((name) => existsSync(join(cwd, name)));
  const target = join(cwd, "eslint.config.mjs");
  const minimal = `import iimpNextStrict from "official-uikit-iimp/eslint/next-strict"\n\nexport default iimpNextStrict\n`;
  if (!currentName) {
    write(target, minimal);
    return;
  }

  const currentPath = join(cwd, currentName);
  const content = readFileSync(currentPath, "utf8");
  if (content.includes("official-uikit-iimp/eslint/next-strict")) return;
  if (
    !content.includes("export default") &&
    !content.includes("module.exports")
  ) {
    write(join(cwd, ".iimp", "eslint.config.mjs.proposed"), minimal);
    return;
  }

  const backupName = `eslint.config.pre-iimp${currentName.slice("eslint.config".length)}`;
  const backupPath = join(cwd, backupName);
  if (!existsSync(backupPath)) renameSync(currentPath, backupPath);
  const wrapper = `import previousConfig from "./${backupName}"\nimport iimpNextStrict from "official-uikit-iimp/eslint/next-strict"\n\nconst previous = Array.isArray(previousConfig) ? previousConfig : [previousConfig]\n\nexport default [...previous, ...iimpNextStrict]\n`;
  write(target, wrapper);
}

function findGlobalCss(cwd) {
  const candidates = [
    "src/app/globals.css",
    "app/globals.css",
    "src/styles/globals.css",
  ];
  return (
    candidates.find((path) => existsSync(join(cwd, path))) ??
    "src/app/globals.css"
  );
}

function configureStyles(cwd) {
  const relativePath = findGlobalCss(cwd);
  const path = join(cwd, relativePath);
  const current = existsSync(path) ? readFileSync(path, "utf8") : "";
  const imports = [];
  if (!current.includes('@import "tailwindcss"'))
    imports.push('@import "tailwindcss";');
  if (!current.includes("official-uikit-iimp/theme.css"))
    imports.push('@import "official-uikit-iimp/theme.css";');
  if (!current.includes("official-uikit-iimp/dist")) {
    // Tailwind no escanea node_modules: sin esto faltan utilidades (lg:grid, lg:flex...) de los patterns.
    const toRoot = relative(dirname(path), join(cwd, "node_modules"));
    imports.push(
      `/* Tailwind no escanea node_modules: sin esto faltan las utilidades de los patterns del kit. */\n@source "${toRoot.split(sep).join("/")}/official-uikit-iimp/dist";`,
    );
  }
  if (imports.length) write(path, `${imports.join("\n")}\n${current}`);

  const postcssPath = join(cwd, "postcss.config.mjs");
  if (!existsSync(postcssPath)) {
    write(
      postcssPath,
      `const config = { plugins: { "@tailwindcss/postcss": {} } }\n\nexport default config\n`,
    );
  }
}

function configurePrettier(cwd) {
  const hasConfig = [
    ".prettierrc",
    ".prettierrc.json",
    "prettier.config.js",
    "prettier.config.mjs",
  ].some((name) => existsSync(join(cwd, name)));
  if (!hasConfig)
    write(
      join(cwd, ".prettierrc.json"),
      `${JSON.stringify({ semi: false, singleQuote: false, trailingComma: "all" }, null, 2)}\n`,
    );
  if (!existsSync(join(cwd, ".prettierignore")))
    write(
      join(cwd, ".prettierignore"),
      ".next\ncoverage\ndist\nnext-env.d.ts\nnode_modules\npublic\n",
    );
}

function configureAgents(cwd) {
  const path = join(cwd, "AGENTS.md");
  const marker = "<!-- iimp-adopt:start -->";
  const current = existsSync(path)
    ? readFileSync(path, "utf8")
    : "# AGENTS.md\n";
  if (current.includes(marker)) return;
  const block = `\n${marker}\n## Estándar IIMP obligatorio\n\n- Ejecutar \`npm run check\` antes de finalizar cualquier cambio.\n- Cero errores y cero warnings; no desactivar reglas para ocultar problemas.\n- Usar componentes desde \`official-uikit-iimp\`; no duplicar primitives shadcn localmente.\n- Buscar primero un pattern, luego un primitive y finalmente proponer una extensión del UI Kit.\n- No hardcodear colores de marca ni modificar lógica de negocio durante migraciones visuales.\n- Antes de continuar, leer \`bitacora.md\`. Por cada avance relevante, registrar fecha/hora, cambio y validación con \`npm run bitacora -- "descripción"\`. No eliminar entradas previas.\n- Usar caveman full como estilo de comunicación predeterminado salvo indicación contraria del usuario.\n${"<!-- iimp-adopt:end -->"}\n`;
  write(path, `${current.trimEnd()}\n${block}`);
}

function configureAgentEntrypoints(cwd) {
  const marker = "<!-- iimp-agent-context:start -->";
  const targets = ["CLAUDE.md", "GEMINI.md"];
  const block = `\n${marker}\n## Contexto IIMP obligatorio\n\n1. Leer y obedecer \`AGENTS.md\`.\n2. Leer \`bitacora.md\` antes de modificar el proyecto.\n3. Al finalizar cada avance relevante, agregar fecha/hora, cambio y validación con \`npm run bitacora -- "descripción"\`.\n4. No borrar ni reescribir entradas históricas de la bitácora.\n${"<!-- iimp-agent-context:end -->"}\n`;
  for (const name of targets) {
    const path = join(cwd, name);
    const current = existsSync(path)
      ? readFileSync(path, "utf8")
      : `# ${name}\n`;
    if (!current.includes(marker))
      write(path, `${current.trimEnd()}\n${block}`);
  }
}

function configureBitacoraScript(cwd) {
  ensureBitacora(cwd);
  const path = join(cwd, "scripts", "append-bitacora.mjs");
  if (existsSync(path)) return;
  write(
    path,
    `import { appendFileSync, existsSync, writeFileSync } from "node:fs";\nimport { join } from "node:path";\n\nconst path = join(globalThis.process.cwd(), "bitacora.md");\nconst template = "# Bitácora del proyecto\\n\\nRegistro cronológico de cambios, decisiones y validaciones.\\n\\n## Regla de uso\\n\\n- Leer este archivo antes de continuar.\\n- Agregar una entrada por cada avance relevante.\\n- No eliminar entradas anteriores.\\n\\n## Entradas\\n\\n";\nconst summary = globalThis.process.argv.slice(2).join(" ").trim();\n\nif (!summary) {\n  globalThis.console.error('Uso: npm run bitacora -- "descripción del avance"');\n  globalThis.process.exitCode = 1;\n} else {\n  if (!existsSync(path)) writeFileSync(path, template);\n  const timestamp = new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "medium", timeZone: "America/Lima", hour12: false }).format(new Date());\n  appendFileSync(path, \`- \${timestamp} America/Lima — \${summary}\\n\`);\n  globalThis.console.log(\`Bitácora actualizada: \${path}\`);\n}\n`,
  );
}

function configureWorkflow(cwd) {
  const path = join(cwd, ".github", "workflows", "iimp-quality.yml");
  if (existsSync(path)) return;
  write(
    path,
    `name: IIMP Quality\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      - run: npm ci\n      - run: npm run check\n        env:\n          IIMP_SECURITY_GATE_LOCK: "1"\n`,
  );
}

export function applyConfiguration(cwd) {
  configurePackageJson(cwd);
  configureBitacoraScript(cwd);
  configureSecurityGate(cwd);
  configureTsconfig(cwd);
  configureEslint(cwd);
  configureStyles(cwd);
  configurePrettier(cwd);
  configureAgents(cwd);
  configureAgentEntrypoints(cwd);
  configureWorkflow(cwd);
}
