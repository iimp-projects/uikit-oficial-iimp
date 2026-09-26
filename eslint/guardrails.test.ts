import { describe, expect, it } from "vitest"
import { ESLint } from "eslint"
// @ts-expect-error plain JS module
import { iimpGuardrails } from "./index.js"

async function lint(code: string) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      { files: ["**/*.tsx"], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
      ...iimpGuardrails,
    ],
  })
  const [result] = await eslint.lintText(code, { filePath: "app.tsx" })
  return result.messages.map((m) => m.message)
}

describe("iimp guardrails", () => {
  it("flags native <button> and names the replacement", async () => {
    const msgs = await lint("export const A = () => <button>ok</button>")
    expect(msgs[0]).toContain("<Button>")
  })
  it("flags native table markup", async () => {
    const msgs = await lint("export const A = () => <table><tbody><tr><td>x</td></tr></tbody></table>")
    expect(msgs.some((m) => m.includes("<Table>"))).toBe(true)
  })
  it("flags <hr> and points to Separator", async () => {
    expect((await lint("export const A = () => <hr />"))[0]).toContain("<Separator>")
  })
  it("flags bare border classes (render black lines)", async () => {
    expect((await lint('export const A = () => <div className="border-b p-4" />'))[0]).toContain("border-border")
  })
  it("allows borders with a token color", async () => {
    expect(await lint('export const A = () => <div className="border-b border-border p-4" />')).toEqual([])
  })
  it("allows borders with any explicit color", async () => {
    expect(await lint('export const A = () => <div className="border-b border-white/10" />')).toEqual([])
    expect(await lint('export const A = () => <div className="border border-red-500" />')).toEqual([])
  })
  it("flags bare width borders", async () => {
    expect((await lint('export const A = () => <div className="border-b-2 p-2" />'))[0]).toContain("border-border")
  })
  it("flags direct Radix imports", async () => {
    const msgs = await lint('import { Dialog } from "radix-ui"\nexport const A = Dialog')
    expect(msgs[0]).toContain("Radix")
  })
})
