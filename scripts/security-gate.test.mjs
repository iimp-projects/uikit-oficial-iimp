import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { evaluate, hashSource, verify } from "../templates/next-starter/scripts/security-gate.mjs";

const meta = { run_status: "complete" };
const att = { sourceHash: "h" };
const base = { metadata: meta, attestation: att, currentHash: "h" };

test("clean audit passes", () => assert.deepEqual(evaluate({ ...base, findings: [] }), []));
test("confirmed finding always blocks, even if listed as accepted", () => {
  const errors = evaluate({
    ...base,
    findings: [{ verdict: "confirmed", fingerprint: "a", title: "SQLi" }],
    accepted: [{ fingerprint: "a", reason: "no vamos a arreglarlo", approvedBy: "x" }],
  });
  assert.equal(errors.length, 1);
});
test("needs_validation blocks unless accepted with reason and approver", () => {
  const f = [{ verdict: "needs_validation", fingerprint: "n" }];
  assert.equal(evaluate({ ...base, findings: f }).length, 1);
  assert.equal(evaluate({ ...base, findings: f, accepted: [{ fingerprint: "n", reason: "corto", approvedBy: "x" }] }).length, 1);
  assert.deepEqual(
    evaluate({ ...base, findings: f, accepted: [{ fingerprint: "n", reason: "requiere entorno productivo", approvedBy: "ana" }] }),
    [],
  );
});
test("rejected findings do not block", () =>
  assert.deepEqual(evaluate({ ...base, findings: [{ verdict: "rejected", fingerprint: "r" }] }), []));
test("incomplete run, missing attestation or stale hash block", () => {
  assert.equal(evaluate({ ...base, findings: [], metadata: { run_status: "incomplete" } }).length, 1);
  assert.equal(evaluate({ ...base, findings: [], attestation: undefined }).length, 1);
  assert.equal(evaluate({ ...base, findings: [], currentHash: "other" }).length, 1);
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
test("adopt template is byte-identical to the starter script", () => {
  const read = (path) => readFileSync(join(import.meta.dirname, path), "utf8");
  assert.equal(
    read("../packages/adopt/templates/security-gate.mjs"),
    read("../templates/next-starter/scripts/security-gate.mjs"),
  );
});
