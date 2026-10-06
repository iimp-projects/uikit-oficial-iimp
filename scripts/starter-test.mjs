import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = mkdtempSync(join(tmpdir(), "iimp-starter-"));
const app = join(output, "app");

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

try {
  run("npm", ["pack", "--pack-destination", output], root);
  run(
    "npm",
    ["pack", "--workspace", "@nrivera-iimp/adopt", "--pack-destination", output],
    root,
  );
  const tarballs = readdirSync(output).filter((name) => name.endsWith(".tgz"));
  const uiTarball = tarballs.find((name) =>
    name.startsWith("official-uikit-iimp-"),
  );
  const adoptTarball = tarballs.find((name) =>
    name.startsWith("nrivera-iimp-adopt-"),
  );
  if (!uiTarball || !adoptTarball)
    throw new Error("No se generaron los tarballs esperados");

  cpSync(join(root, "templates", "next-starter"), app, { recursive: true });
  const packagePath = join(app, "package.json");
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  packageJson.dependencies["official-uikit-iimp"] =
    `file:${join(output, uiTarball)}`;
  packageJson.devDependencies["@nrivera-iimp/adopt"] =
    `file:${join(output, adoptTarball)}`;
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  run("npm", ["install", "--no-audit", "--no-fund"], app);
  run("npm", ["exec", "iimp-adopt", "--", "--dry-run"], app);
  execFileSync("npm", ["run", "check"], {
    cwd: app,
    stdio: "inherit",
    env: { ...process.env, IIMP_SECURITY_GATE: "skip" },
  });
  console.log("starter contract OK");
} finally {
  rmSync(output, { recursive: true, force: true });
}
