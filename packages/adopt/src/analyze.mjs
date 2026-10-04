import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { NATIVE_REPLACEMENTS } from "./constants.mjs";

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "storybook-static",
]);

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function extension(path) {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index);
}

function collectSourceFiles(directory, files = []) {
  if (!existsSync(directory)) return files;
  for (const entry of readdirSync(directory)) {
    if (IGNORED_DIRECTORIES.has(entry)) continue;
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) collectSourceFiles(path, files);
    else if (SOURCE_EXTENSIONS.has(extension(path))) files.push(path);
  }
  return files;
}

export function detectPackageManager(cwd) {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb")))
    return "bun";
  return "npm";
}

export function analyzeProject(cwd) {
  const packageJson = readJson(join(cwd, "package.json")) ?? {};
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };
  const sourceFiles = collectSourceFiles(cwd);
  const nativeUsage = [];

  for (const file of sourceFiles) {
    const content = readFileSync(file, "utf8");
    for (const [tag, replacement] of Object.entries(NATIVE_REPLACEMENTS)) {
      const matches = content.match(new RegExp(`<${tag}(?:\\s|>)`, "g"));
      if (matches?.length) {
        nativeUsage.push({
          file: relative(cwd, file),
          tag,
          replacement,
          count: matches.length,
        });
      }
    }
  }

  const detected = {
    next: dependencies.next ?? null,
    react: dependencies.react ?? null,
    typescript: dependencies.typescript ?? null,
    tailwind: dependencies.tailwindcss ?? null,
    prisma: Boolean(dependencies.prisma || dependencies["@prisma/client"]),
    drizzle: Boolean(dependencies["drizzle-orm"]),
    postgres: Boolean(dependencies.pg || dependencies.postgres),
    mysql: Boolean(dependencies.mysql || dependencies.mysql2),
    auth: Boolean(
      dependencies["next-auth"] ||
      dependencies["@auth/core"] ||
      dependencies["@clerk/nextjs"],
    ),
    aws: Object.keys(dependencies).some((name) => name.startsWith("@aws-sdk/")),
    terraform:
      existsSync(join(cwd, "terraform")) ||
      readdirSync(cwd).some((name) => name.endsWith(".tf")),
  };

  return {
    cwd,
    packageManager: detectPackageManager(cwd),
    packageJson,
    dependencies,
    detected,
    nativeUsage,
    hasTsconfig: existsSync(join(cwd, "tsconfig.json")),
    hasEslint: [
      "eslint.config.mjs",
      "eslint.config.js",
      "eslint.config.cjs",
    ].some((name) => existsSync(join(cwd, name))),
    hasTailwindCss: [
      "src/app/globals.css",
      "app/globals.css",
      "src/styles/globals.css",
    ].some((name) => existsSync(join(cwd, name))),
  };
}

const DEPENDENCY_SIGNALS = [
  { deps: ["next"], query: "nextjs", keywords: ["next"] },
  { deps: ["react"], query: "react", keywords: ["react"] },
  { deps: ["tailwindcss"], query: "tailwind", keywords: ["tailwind"] },
  { deps: ["zod"], query: "zod", keywords: ["zod"] },
  { deps: ["vitest"], query: "vitest", keywords: ["vitest"] },
  {
    deps: ["@tanstack/react-query"],
    query: "tanstack query",
    keywords: ["tanstack", "react-query"],
  },
  { deps: ["@trpc/server", "@trpc/client"], query: "trpc", keywords: ["trpc"] },
  {
    deps: ["next-auth", "@auth/core"],
    query: "nextjs authentication",
    keywords: ["auth"],
  },
  { deps: ["@clerk/nextjs"], query: "clerk", keywords: ["clerk"] },
  { deps: ["better-auth"], query: "better-auth", keywords: ["better-auth"] },
  {
    deps: ["prisma", "@prisma/client"],
    query: "prisma",
    keywords: ["prisma"],
  },
  { deps: ["drizzle-orm"], query: "drizzle", keywords: ["drizzle"] },
  { deps: ["pg", "postgres"], query: "postgresql", keywords: ["postgres"] },
  { deps: ["mysql", "mysql2"], query: "mysql", keywords: ["mysql"] },
  {
    deps: ["@supabase/supabase-js"],
    query: "supabase",
    keywords: ["supabase"],
  },
  { deps: ["firebase"], query: "firebase", keywords: ["firebase"] },
  { deps: ["stripe"], query: "stripe", keywords: ["stripe"] },
  { deps: ["@sentry/nextjs"], query: "sentry", keywords: ["sentry"] },
  { prefix: "@aws-sdk/", query: "aws serverless", keywords: ["aws"] },
];

export function recommendationQueries(analysis) {
  const names = Object.keys(analysis.dependencies ?? {});
  const queries = [];
  for (const signal of DEPENDENCY_SIGNALS) {
    const present = signal.prefix
      ? names.some((name) => name.startsWith(signal.prefix))
      : signal.deps.some((name) => names.includes(name));
    if (present)
      queries.push({ query: signal.query, keywords: signal.keywords });
  }
  if (analysis.detected?.terraform)
    queries.push({ query: "terraform", keywords: ["terraform"] });
  return queries;
}

const OTHER_STACKS = [
  "expo",
  "native",
  "cloudflare",
  "gsap",
  "flutter",
  "angular",
  "vue",
  "svelte",
  "nuxt",
  "remix",
  "astro",
];

export function foreignKeywords(queries) {
  const own = new Set(queries.flatMap(({ keywords }) => keywords));
  const all = DEPENDENCY_SIGNALS.flatMap(({ keywords }) => keywords);
  return [...new Set([...all, ...OTHER_STACKS])].filter(
    (keyword) => !own.has(keyword),
  );
}
