import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf8"),
)
const expectedVersion = `v${packageJson.version}`
const checkOnly = globalThis.process.argv.includes("--check")
const environmentFiles = [".env.example", ".env.local"]

function readVersion(contents) {
  return contents.match(/^NEXT_PUBLIC_APP_VERSION=(.+)$/m)?.[1]?.trim()
}

for (const filename of environmentFiles) {
  const path = resolve(root, filename)
  if (!existsSync(path)) {
    if (filename === ".env.example" && checkOnly) {
      throw new Error("Falta .env.example con NEXT_PUBLIC_APP_VERSION")
    }
    continue
  }

  const contents = readFileSync(path, "utf8")
  const currentVersion = readVersion(contents)

  if (checkOnly) {
    if (currentVersion !== expectedVersion) {
      throw new Error(
        `${filename} debe declarar NEXT_PUBLIC_APP_VERSION=${expectedVersion}`,
      )
    }
    continue
  }

  const nextContents = currentVersion
    ? contents.replace(
        /^NEXT_PUBLIC_APP_VERSION=.+$/m,
        `NEXT_PUBLIC_APP_VERSION=${expectedVersion}`,
      )
    : `${contents.trimEnd()}\nNEXT_PUBLIC_APP_VERSION=${expectedVersion}\n`
  writeFileSync(path, nextContents)
}

if (!checkOnly)
  globalThis.console.log(
    `Versión de aplicación sincronizada: ${expectedVersion}`,
  )
