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
  it("flags local copies of official layout patterns", async () => {
    const msgs = await lint(
      'import { AuthLayout, DashboardLayout, DashboardHeader, DashboardSidebarBrand, DashboardSidebarUser, DashboardNotifications } from "@/components/layouts"\nexport const A = () => null'
    )
    expect(msgs).toHaveLength(6)
    expect(msgs.every((message) => message.includes("official-uikit-iimp"))).toBe(true)
  })
  it("allows official layout pattern imports", async () => {
    expect(
      await lint(
        'import { AuthLayout, DashboardLayout, DashboardHeader, DashboardSidebarBrand, DashboardSidebarUser, DashboardNotifications } from "official-uikit-iimp"\nexport const A = () => null'
      )
    ).toEqual([])
  })

  it("flags icon-only Button without aria-label and without size icon", async () => {
    const msgs = await lint('export const A = () => <Button variant="ghost"><EyeIcon /></Button>')
    expect(msgs.some((m) => m.includes("aria-label"))).toBe(true)
    expect(msgs.some((m) => m.includes('size="icon"'))).toBe(true)
  })
  it("allows icon-only Button with aria-label and size icon", async () => {
    expect(await lint('export const A = () => <Button size="icon-sm" aria-label="Ver"><EyeIcon /></Button>')).toEqual([])
  })
  it("allows icon + text Button and icon + sr-only text", async () => {
    expect(await lint("export const A = () => <Button><DownloadIcon /> Exportar</Button>")).toEqual([])
    expect(await lint('export const A = () => <Button size="icon"><EyeIcon /><span className="sr-only">Ver</span></Button>')).toEqual([])
  })
  it("recommends ButtonGroup for 2+ adjacent buttons of the same level", async () => {
    const msgs = await lint(
      'export const A = () => <div><Button variant="outline">A</Button><Button variant="outline">B</Button></div>'
    )
    expect(msgs[0]).toContain("ButtonGroup")
  })
  it("does not flag buttons already inside ButtonGroup, footers or Primary + secondary-level combos", async () => {
    expect(await lint('export const A = () => <ButtonGroup><Button variant="outline">A</Button><Button variant="outline">B</Button></ButtonGroup>')).toEqual([])
    expect(await lint('export const A = () => <DialogFooter><Button variant="outline">A</Button><Button variant="outline">B</Button></DialogFooter>')).toEqual([])
    expect(await lint('export const A = () => <div><Button>Guardar</Button><Button variant="outline">Cancelar</Button></div>')).toEqual([])
  })
  it("flags overriding TableHead font size or weight", async () => {
    expect((await lint('export const A = () => <TableHead className="text-sm">x</TableHead>'))[0]).toContain("12px")
    expect((await lint('export const A = () => <TableHead className="font-medium">x</TableHead>'))[0]).toContain("bolder")
    expect(await lint('export const A = () => <TableHead className="text-muted-foreground w-24">x</TableHead>')).toEqual([])
  })
  it("asks for FormGrid instead of manual columns of FormFields", async () => {
    const msgs = await lint(
      'export const A = () => <div className="grid grid-cols-4 gap-4"><FormField label="a"><Input /></FormField><FormField label="b"><Input /></FormField></div>'
    )
    expect(msgs[0]).toContain("FormGrid")
    const flexRow = await lint(
      'export const A = () => <div className="flex gap-4"><FormField label="a"><Input /></FormField><FormField label="b"><Input /></FormField></div>'
    )
    expect(flexRow[0]).toContain("FormGrid")
  })
  it("allows FormGrid, stacked FormFields and a single field", async () => {
    expect(await lint('export const A = () => <FormGrid><FormField label="a"><Input /></FormField><FormField label="b"><Input /></FormField></FormGrid>')).toEqual([])
    expect(await lint('export const A = () => <div className="flex flex-col gap-4"><FormField label="a"><Input /></FormField><FormField label="b"><Input /></FormField></div>')).toEqual([])
    expect(await lint('export const A = () => <div className="grid grid-cols-2"><FormField label="a"><Input /></FormField></div>')).toEqual([])
  })
  it("flags fractional widths on FormField or its wrapper (the 25% gap bug)", async () => {
    expect((await lint('export const A = () => <FormField label="a" className="w-1/4"><Input /></FormField>'))[0]).toContain("hueco")
    expect((await lint('export const A = () => <div className="w-[25%]"><FormField label="a"><Input /></FormField></div>'))[0]).toContain("hueco")
    expect(await lint('export const A = () => <FormField label="a" className="col-span-full"><Input /></FormField>')).toEqual([])
  })
  it("flags fixed widths on controls inside FormField (they leave a gap)", async () => {
    expect((await lint('export const A = () => <FormField label="a"><Input className="w-40" /></FormField>'))[0]).toContain("llenar su celda")
    expect((await lint('export const A = () => <FormField label="a"><Select><SelectTrigger className="w-fit" /></Select></FormField>'))[0]).toContain("llenar su celda")
    expect(await lint('export const A = () => <FormField label="a"><Select><SelectTrigger className="w-full" /><SelectContent className="w-72" /></Select></FormField>')).toEqual([])
  })
})
