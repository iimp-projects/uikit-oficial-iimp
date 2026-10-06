#!/usr/bin/env node
// Gate de seguridad del build.
//   npm run security:audit   -> lanza la skill `security-audit` (agente sin interfaz) y guarda la evidencia en .security/
//   npm run security:verify  -> lo corre `prebuild`: falla si no hay auditoría vigente y limpia.
// La skill es un flujo de agente (usa tokens); por eso la auditoría es un paso explícito y el build
// solo verifica su evidencia. Cualquier cambio en src/ o en el lockfile invalida la evidencia.
import { createHash } from "node:crypto"
import { spawnSync } from "node:child_process"
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { homedir } from "node:os"
import { basename, join, relative } from "node:path"
import { pathToFileURL } from "node:url"

const { console, process } = globalThis

const SKILL_DIRECTORIES = [
  ".agents/skills",
  ".claude/skills",
  ".codex/skills",
  ".gemini/skills",
]
const HASHED = [
  "src",
  "app",
  "pages",
  "middleware.ts",
  "next.config.ts",
  "next.config.mjs",
  "package-lock.json",
]
const SKIPPED = new Set(["node_modules", ".next", ".git"])
const EVIDENCE = [
  "findings.json",
  "run-metadata.json",
  "coverage-ledger.json",
  "REPORT.md",
]

export function hashSource(cwd) {
  const hash = createHash("sha256")
  const files = []
  const walk = (path) => {
    const stat = statSync(path)
    if (stat.isDirectory()) {
      for (const entry of readdirSync(path).sort())
        if (!SKIPPED.has(entry)) walk(join(path, entry))
    } else files.push(path)
  }
  for (const item of HASHED)
    if (existsSync(join(cwd, item))) walk(join(cwd, item))
  for (const file of files.sort()) {
    hash.update(relative(cwd, file))
    hash.update(readFileSync(file))
  }
  return hash.digest("hex")
}

/** Pura y testeable: devuelve la lista de motivos por los que el build debe fallar. */
export function evaluate({
  findings,
  accepted = [],
  metadata,
  attestation,
  currentHash,
}) {
  const errors = []
  if (!Array.isArray(findings))
    return ["findings.json no es un arreglo válido."]
  if (!metadata) errors.push("Falta .security/run-metadata.json.")
  else if (metadata.run_status !== "complete")
    errors.push(
      `La auditoría no terminó (run_status = ${String(metadata.run_status)}). Vuelve a correr npm run security:audit.`,
    )
  if (!attestation) errors.push("Falta .security/attestation.json.")
  else if (attestation.sourceHash !== currentHash)
    errors.push(
      "El código cambió después de la última auditoría (hash distinto). Corre npm run security:audit.",
    )

  const approved = new Map()
  for (const item of Array.isArray(accepted) ? accepted : []) {
    if (
      item?.fingerprint &&
      String(item.reason ?? "").trim().length >= 10 &&
      String(item.approvedBy ?? "").trim()
    )
      approved.set(item.fingerprint, item)
  }
  for (const finding of findings) {
    if (finding.verdict === "confirmed")
      errors.push(
        `Vulnerabilidad confirmada sin parchar: ${finding.fingerprint} — ${finding.title ?? ""}`.trim(),
      )
    else if (
      finding.verdict === "needs_validation" &&
      !approved.has(finding.fingerprint)
    )
      errors.push(
        `Hallazgo pendiente de validar: ${finding.fingerprint} — ${finding.title ?? ""}. Resuélvelo o regístralo en .security/accepted.json (fingerprint, reason ≥10 caracteres, approvedBy).`.trim(),
      )
  }
  return errors
}

function readJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined
}

function findValidator(cwd) {
  for (const base of SKILL_DIRECTORIES) {
    const path = join(cwd, base, "security-audit", "validate-findings.cjs")
    if (existsSync(path)) return path
  }
  return undefined
}

function skipped() {
  if (
    process.env.IIMP_SECURITY_GATE !== "skip" ||
    process.env.IIMP_SECURITY_GATE_LOCK === "1"
  )
    return false
  console.warn(
    "⚠ SECURITY GATE OMITIDO (IIMP_SECURITY_GATE=skip). No uses esto para publicar.",
  )
  return true
}

export function verify(cwd = process.cwd()) {
  const dir = join(cwd, ".security")
  const findingsPath = join(dir, "findings.json")
  if (!existsSync(findingsPath))
    return [
      "No hay auditoría de seguridad (.security/findings.json). Corre npm run security:audit antes de compilar.",
    ]
  const validator = findValidator(cwd)
  if (!validator)
    return ["No está instalada la skill security-audit. Corre npm run setup."]
  const validation = spawnSync("node", [validator, findingsPath], {
    encoding: "utf8",
  })
  if (validation.status !== 0)
    return [
      `findings.json no pasa el validador de la skill:\n${validation.stdout}${validation.stderr}`,
    ]
  return evaluate({
    findings: readJson(findingsPath),
    accepted: readJson(join(dir, "accepted.json")),
    metadata: readJson(join(dir, "run-metadata.json")),
    attestation: readJson(join(dir, "attestation.json")),
    currentHash: hashSource(cwd),
  })
}

function latestRunDir(base) {
  if (!existsSync(base)) return undefined
  const runs = readdirSync(base)
    .filter((name) => /^run-\d+$/.test(name))
    .map((name) => ({ name, time: statSync(join(base, name)).mtimeMs }))
    .sort((a, b) => b.time - a.time)
  return runs[0] ? join(base, runs[0].name) : undefined
}

function audit(cwd = process.cwd()) {
  const repo = basename(cwd)
  const base = join(homedir(), "security-audit-skill", repo)
  const prompt =
    `Use the security-audit skill in full audit mode, profile "standard", on the repository at ${cwd}. ` +
    `Do not ask questions. Use the default output directory under ${base}. Do not install dependencies. ` +
    `When finished, print the absolute run directory on its own line as RUN_DIR=<path>.`
  const custom = process.env.IIMP_SECURITY_AUDIT_CMD
  const result = custom
    ? spawnSync(custom, {
        cwd,
        shell: true,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "inherit"],
      })
    : spawnSync(
        "claude",
        [
          "-p",
          prompt,
          "--add-dir",
          join(homedir(), "security-audit-skill"),
          "--permission-mode",
          "acceptEdits",
          "--allowedTools",
          "Read,Grep,Glob,Write,Edit,Agent,Bash(node:*)",
        ],
        { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
      )
  if (result.error || result.status !== 0) {
    console.error(
      "La auditoría no terminó correctamente.",
      result.error?.message ?? "",
    )
    return 1
  }
  const runDir =
    /RUN_DIR=(\S+)/.exec(result.stdout ?? "")?.[1] ?? latestRunDir(base)
  if (!runDir || !existsSync(join(runDir, "findings.json"))) {
    console.error(
      "No se encontró findings.json en el directorio de la auditoría.",
    )
    return 1
  }
  const dir = join(cwd, ".security")
  mkdirSync(dir, { recursive: true })
  for (const name of EVIDENCE)
    if (existsSync(join(runDir, name)))
      copyFileSync(join(runDir, name), join(dir, name))
  writeFileSync(
    join(dir, "attestation.json"),
    `${JSON.stringify({ sourceHash: hashSource(cwd), auditedAt: new Date().toISOString(), runDir }, null, 2)}\n`,
  )
  return report(verify(cwd))
}

function report(errors) {
  if (errors.length === 0) {
    console.log("Security gate OK: auditoría vigente, sin hallazgos abiertos.")
    return 0
  }
  console.error("Security gate FALLÓ:")
  for (const error of errors) console.error(`  - ${error}`)
  return 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const command = process.argv[2] ?? "verify"
  if (command === "audit") process.exitCode = audit()
  else if (process.argv.includes("--warn")) {
    // predev: muestra el estado de la auditoría sin bloquear el servidor de desarrollo.
    const errors = skipped() ? [] : verify()
    if (errors.length > 0) {
      console.warn(
        "\n⚠ Auditoría de seguridad pendiente (el build la exigirá):",
      )
      for (const error of errors) console.warn(`  - ${error}`)
      console.warn(
        "  Corre `npm run security:audit` y corrige los hallazgos.\n",
      )
    }
  } else process.exitCode = skipped() ? 0 : report(verify())
}
