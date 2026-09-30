import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { BASELINE_SKILLS } from "./constants.mjs";
import { recommendationQueries } from "./analyze.mjs";

const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, "g");

export function isSkillInstalled(cwd, name) {
  return [".agents/skills", ".codex/skills", ".claude/skills"].some((base) =>
    existsSync(join(cwd, base, name, "SKILL.md")),
  );
}

export function missingBaselineSkills(cwd) {
  return BASELINE_SKILLS.filter(({ name }) => !isSkillInstalled(cwd, name));
}

function groupedBySource(skills) {
  const groups = new Map();
  for (const skill of skills) {
    const current = groups.get(skill.source) ?? [];
    current.push(skill.name);
    groups.set(skill.source, current);
  }
  return groups;
}

export function installSkills(cwd, skills) {
  for (const [source, names] of groupedBySource(skills)) {
    execFileSync(
      "npx",
      [
        "-y",
        "skills",
        "add",
        source,
        "--skill",
        ...names,
      "--agent",
      "codex",
      "claude-code",
        "--copy",
        "-y",
      ],
      {
        cwd,
        stdio: "inherit",
      },
    );
  }
}

function installsToNumber(value, suffix) {
  const multiplier = suffix === "M" ? 1_000_000 : suffix === "K" ? 1_000 : 1;
  return Number.parseFloat(value) * multiplier;
}

export function parseSkillSearch(outputText) {
  const clean = outputText.replace(ANSI, "");
  const results = [];
  for (const line of clean.split("\n")) {
    const match = line
      .trim()
      .match(/^([^\s]+\/[^\s]+)@([^\s]+)\s+([\d.]+)([KM]?) installs$/);
    if (!match) continue;
    results.push({
      source: `https://github.com/${match[1]}`,
      name: match[2],
      installs: installsToNumber(match[3], match[4]),
    });
  }
  return results;
}

export function discoverRecommendedSkills(cwd, analysis) {
  const found = new Map();
  for (const query of recommendationQueries(analysis)) {
    let result = "";
    try {
      result = execFileSync("npx", ["-y", "skills", "find", query], {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      result = `${error?.stdout ?? ""}\n${error?.stderr ?? ""}`;
    }
    for (const skill of parseSkillSearch(result)) {
      if (
        isSkillInstalled(cwd, skill.name) ||
        BASELINE_SKILLS.some(({ name }) => name === skill.name)
      )
        continue;
      const previous = found.get(skill.name);
      if (!previous || previous.installs < skill.installs)
        found.set(skill.name, skill);
    }
  }
  return [...found.values()]
    .sort((a, b) => b.installs - a.installs)
    .slice(0, 12);
}

export async function selectRecommendedSkills(recommendations) {
  if (!recommendations.length || !input.isTTY) return [];
  console.log("\nSkills adicionales recomendadas para este proyecto:\n");
  recommendations.forEach((skill, index) => {
    console.log(
      `  ${index + 1}. ${skill.name} (${Math.round(skill.installs).toLocaleString("en-US")} instalaciones) — ${skill.source}`,
    );
  });
  const readline = createInterface({ input, output });
  const answer = (
    await readline.question(
      "\nEscribe all, números separados por coma, o Enter para omitir: ",
    )
  )
    .trim()
    .toLowerCase();
  readline.close();
  if (answer === "all") return recommendations;
  if (!answer) return [];
  const indexes = new Set(
    answer.split(",").map((value) => Number.parseInt(value.trim(), 10) - 1),
  );
  return recommendations.filter((_, index) => indexes.has(index));
}
