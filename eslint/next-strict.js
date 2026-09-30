import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { iimpGuardrails } from "./index.js";

const typedFiles = ["**/*.{ts,tsx,mts,cts}"];
const scopeToTypedFiles = (configs) =>
  configs.map((config) => ({ ...config, files: typedFiles }));

/**
 * Configuración flat de ESLint para aplicaciones Next.js consumidoras.
 *
 * Incluye Core Web Vitals, reglas TypeScript con información de tipos y los
 * guardrails visuales del UI Kit. La app debe ejecutarla con
 * `eslint . --max-warnings=0` para aplicar la política zero-errors.
 */
const iimpNextStrict = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  ...scopeToTypedFiles(tseslint.configs.strictTypeChecked),
  ...scopeToTypedFiles(tseslint.configs.stylisticTypeChecked),
  {
    files: typedFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },
  ...iimpGuardrails,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);

export default iimpNextStrict;
export { iimpNextStrict };
