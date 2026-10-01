export const UI_KIT_VERSION = "0.8.1";

export const STRICT_COMPILER_OPTIONS = {
  allowJs: false,
  checkJs: false,
  strict: true,
  noUncheckedIndexedAccess: true,
  exactOptionalPropertyTypes: true,
  noImplicitOverride: true,
  noFallthroughCasesInSwitch: true,
  noImplicitReturns: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  useUnknownInCatchVariables: true,
  noEmit: true,
};

export const BASELINE_SKILLS = [
  ["https://github.com/juliusbrussee/caveman", "caveman"],
  ["https://github.com/juliusbrussee/caveman", "caveman-commit"],
  ["https://github.com/juliusbrussee/caveman", "caveman-review"],
  ["https://github.com/juliusbrussee/caveman", "caveman-compress"],
  ["https://github.com/obra/superpowers", "test-driven-development"],
  ["https://github.com/microsoft/playwright-cli", "playwright-cli"],
  [
    "https://github.com/currents-dev/playwright-best-practices-skill",
    "playwright-best-practices",
  ],
  ["https://github.com/cloudflare/security-audit-skill", "security-audit"],
  ["https://github.com/shadcn-ui/ui", "shadcn"],
  ["https://github.com/vercel-labs/agent-skills", "web-design-guidelines"],
  [
    "https://github.com/vercel-labs/agent-skills",
    "vercel-react-view-transitions",
  ],
  ["https://github.com/uizze/uizze", "ui-radar"],
  ["https://github.com/hashicorp/agent-skills", "terraform-style-guide"],
  ["https://github.com/hashicorp/agent-skills", "terraform-test"],
  ["https://github.com/hashicorp/agent-skills", "terraform-stacks"],
  ["https://github.com/hashicorp/agent-skills", "terraform-search-import"],
  ["https://github.com/hashicorp/agent-skills", "new-terraform-provider"],
  ["https://github.com/secondsky/claude-skills", "tailwind-v4-shadcn"],
  ["https://github.com/openai/skills", "security-threat-model"],
  ["https://github.com/getsentry/skills", "security-review"],
  ["https://github.com/addyosmani/agent-skills", "security-and-hardening"],
  ["https://github.com/softaworks/agent-toolkit", "qa-test-planner"],
  ["https://github.com/mindrally/skills", "nextjs-react-typescript"],
  [
    "https://github.com/giuseppe-trisciuoglio/developer-kit",
    "nextjs-authentication",
  ],
  ["https://github.com/wshobson/agents", "nextjs-app-router-patterns"],
  ["https://github.com/mattpocock/skills", "code-review"],
  ["https://github.com/aws/agent-toolkit-for-aws", "aws-serverless"],
  ["https://github.com/vercel-labs/skills", "find-skills"],
].map(([source, name]) => ({ source, name }));

export const NATIVE_REPLACEMENTS = {
  button: "Button",
  input: "Input/Checkbox/RadioGroup/Switch/Slider",
  select: "Select/Combobox",
  textarea: "Textarea",
  label: "Label/FormField",
  table: "Table/DataTable",
  dialog: "Dialog/FormDialog/ConfirmDialog",
  details: "Accordion/Collapsible",
  progress: "Progress",
  hr: "Separator",
};
