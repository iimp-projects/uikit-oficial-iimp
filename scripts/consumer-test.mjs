// Consumer contract test: pack official-uikit-iimp, install the tarball in a clean fixture app,
// typecheck + server-render a component that uses only the public API.
import { execSync } from "node:child_process"
import { mkdtempSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" })

run("npm run build", root)
const out = mkdtempSync(join(tmpdir(), "iimp-consumer-"))
run(`npm pack --pack-destination ${out}`, root)
const tarball = readdirSync(out).find((f) => f.endsWith(".tgz"))

const app = join(out, "app")
mkdirSync(app)
writeFileSync(
  join(app, "package.json"),
  JSON.stringify({ name: "consumer-fixture", private: true, type: "module" })
)
run(
  `npm i ${join(out, tarball)} react@19 react-dom@19 @types/react@19 @types/react-dom@19 typescript tsx --no-audit --no-fund`,
  app
)
writeFileSync(
  join(app, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: { strict: true, jsx: "react-jsx", module: "esnext", moduleResolution: "bundler", target: "es2022", noEmit: true, skipLibCheck: true, types: [] },
    include: ["main.tsx"],
  })
)
writeFileSync(
  join(app, "main.tsx"),
  `import { renderToString } from "react-dom/server"
import { AuthLayout, Button, DashboardHeader, DashboardLayout, DashboardNotifications, DashboardSidebarBrand, DashboardSidebarUser, IimpThemeProvider, ConfirmDialog, FormField, Input } from "official-uikit-iimp"
import { iimpGuardrails } from "official-uikit-iimp/eslint"

const html = renderToString(
  <IimpThemeProvider theme={{ primary: "#092042", secondary: "#f2e8dd", secondaryForeground: "#c09153" }}>
    <FormField label="Nombre"><Input /></FormField>
    <Button variant="secondary">Guardar</Button>
  </IimpThemeProvider>
)
if (!html.includes("Guardar") || !html.includes("--secondary-foreground")) throw new Error("render contract broken")
if (!Array.isArray(iimpGuardrails)) throw new Error("eslint guardrails export broken")
void ConfirmDialog
void AuthLayout
void DashboardHeader
void DashboardLayout
void DashboardNotifications
void DashboardSidebarBrand
void DashboardSidebarUser
console.log("consumer contract OK")
`
)
run("npx tsc -p tsconfig.json", app)
run("npx tsx main.tsx", app)
run(`node -e "for (const f of ['style.css','theme.css']) require('fs').accessSync(require.resolve('official-uikit-iimp/'+f))"`, app)
run(`node -e "const fs=require('fs');const t=fs.readFileSync('node_modules/official-uikit-iimp/dist/index.js','utf8');if(!t.startsWith('\\"use client\\"'))process.exit(2)"`, app)
run(`node -e "import('official-uikit-iimp/style.css').catch(()=>{});require('fs').accessSync(require.resolve('official-uikit-iimp/style.css'))"`, app)
rmSync(out, { recursive: true, force: true })
