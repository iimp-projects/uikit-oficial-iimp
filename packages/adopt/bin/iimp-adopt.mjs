#!/usr/bin/env node

import { runCli } from "../src/cli.mjs";

runCli(process.argv.slice(2)).catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nIIMP Adopt no pudo completar la operación:\n${message}`);
  process.exitCode = 1;
});
