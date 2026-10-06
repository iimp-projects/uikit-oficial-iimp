import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  evaluate,
  hashSource,
  verify,
} from "../templates/next-starter/scripts/security-gate.mjs";

const meta = { run_status: "complete" };
const att = { sourceHash: "h" };
const base = { metadata: meta, attestation: att, currentHash: "h" };

test("clean audit passes", () =>
  assert.deepEqual(evaluate({ ...base, findings: [] }), []));
test("confirmed finding always blocks, even if listed as accepted", () => {
  const errors = evaluate({
    ...base,
    findings: [{ verdict: "confirmed", fingerprint: "a", title: "SQLi" }],
    accepted: [
      { fingerprint: "a", reason: "no vamos a arreglarlo", approvedBy: "x" },
    ],
  });
  assert.equal(errors.length, 1);
});
test("needs_validation blocks unless accepted with reason and approver", () => {
  const f = [{ verdict: "needs_validation", fingerprint: "n" }];
  assert.equal(evaluate({ ...base, findings: f }).length, 1);
  assert.equal(
    evaluate({
      ...base,
      findings: f,
      accepted: [{ fingerprint: "n", reason: "corto", approvedBy: "x" }],
    }).length,
    1,
  );
  assert.deepEqual(
    evaluate({
      ...base,
      findings: f,
      accepted: [
        {
          fingerprint: "n",
          reason: "requiere entorno productivo",
          approvedBy: "ana",
        },
      ],
    }),
    [],
  );
});
test("rejected findings do not block", () =>
  assert.deepEqual(
    evaluate({
      ...base,
      findings: [{ verdict: "rejected", fingerprint: "r" }],
    }),
    [],
  ));
test("incomplete run, missing attestation or stale hash block", () => {
  assert.equal(
    evaluate({ ...base, findings: [], metadata: { run_status: "incomplete" } })
      .length,
    1,
  );
  assert.equal(
    evaluate({ ...base, findings: [], attestation: undefined }).length,
    1,
  );
  assert.equal(
    evaluate({ ...base, findings: [], currentHash: "other" }).length,
    1,
  );
});
test("verify fails without .security and changing src changes the hash", () => {
  const cwd = mkdtempSync(join(tmpdir(), "gate-"));
  mkdirSync(join(cwd, "src"));
  writeFileSync(join(cwd, "src", "a.ts"), "1");
  const before = hashSource(cwd);
  writeFileSync(join(cwd, "src", "a.ts"), "2");
  assert.notEqual(before, hashSource(cwd));
  assert.match(verify(cwd)[0], /security:audit/);
});
test("verify rejects incomplete audit evidence", () => {
  const cwd = mkdtempSync(join(tmpdir(), "gate-incomplete-"));
  mkdirSync(join(cwd, ".security"));
  writeFileSync(join(cwd, ".security", "findings.json"), "[]\n");
  assert.match(verify(cwd)[0], /artefactos.*REPORT\.md/s);
});
test("audit failure shows captured stdout and the partial run directory", () => {
  const cwd = mkdtempSync(join(tmpdir(), "gate-audit-"));
  const fakeHome = join(cwd, "home");
  const runDir = join(
    fakeHome,
    "security-audit-skill",
    cwd.split("/").at(-1),
    "run-1",
  );
  mkdirSync(runDir, { recursive: true });
  writeFileSync(
    join(runDir, "run-metadata.json"),
    '{"run_status":"in_progress"}\n',
  );
  const fakeAgent = join(cwd, "fake-agent.mjs");
  writeFileSync(
    fakeAgent,
    'process.stdout.write("SIMULATED_AGENT_FAILURE\\n"); process.exit(7)\n',
  );
  const gate = join(
    import.meta.dirname,
    "../templates/next-starter/scripts/security-gate.mjs",
  );
  const result = spawnSync(process.execPath, [gate, "audit"], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      HOME: fakeHome,
      IIMP_SECURITY_AUDIT_CMD: `${JSON.stringify(process.execPath)} ${JSON.stringify(fakeAgent)}`,
    },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /SIMULATED_AGENT_FAILURE/);
  assert.match(result.stderr, /run-1/);
  assert.match(result.stderr, /run_status = in_progress/);
});
test("adopt template is byte-identical to the starter script", () => {
  const read = (path) => readFileSync(join(import.meta.dirname, path), "utf8");
  assert.equal(
    read("../packages/adopt/templates/security-gate.mjs"),
    read("../templates/next-starter/scripts/security-gate.mjs"),
  );
});
