import { expect, test } from "@playwright/test"

const columns = (page: import("@playwright/test").Page) =>
  page.$$eval("[data-slot=form-grid] > [data-slot=form-field]", (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      const control = el.querySelector("input,textarea")!.getBoundingClientRect()
      return { left: Math.round(r.left), width: Math.round(r.width), controlTop: Math.round(control.top), top: Math.round(r.top) }
    })
  )

test("FormGrid shows one column in a narrow container", async ({ page }) => {
  await page.goto("/iframe.html?id=patterns-formgrid--narrow-drawer&viewMode=story")
  await page.waitForSelector("[data-slot=form-field]")
  const fields = await columns(page)
  expect(new Set(fields.map((f) => f.left)).size).toBe(1)
})

test("FormGrid fits several columns in a wide container, fills each row and aligns controls", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 })
  await page.goto("/iframe.html?id=patterns-formgrid--wide&viewMode=story")
  await page.waitForSelector("[data-slot=form-field]")
  const fields = await columns(page)
  const firstRow = fields.filter((f) => f.top === fields[0]!.top)
  expect(firstRow.length).toBeGreaterThanOrEqual(3)
  // controls share one baseline even though one field has a description
  expect(new Set(firstRow.map((f) => f.controlTop)).size).toBe(1)
  // the row is filled: last field ends at the container's right edge (no empty gap)
  const container = await page.locator("[data-slot=form-grid]").boundingBox()
  const last = firstRow[firstRow.length - 1]!
  expect(Math.abs(last.left + last.width - (container!.x + container!.width))).toBeLessThanOrEqual(2)
})

test("Select fills its cell and controls align despite descriptions of different length", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 })
  await page.goto("/iframe.html?id=patterns-formgrid--with-select-and-descriptions&viewMode=story")
  await page.waitForSelector("[data-slot=select-trigger]")
  const m = await page.evaluate(() => {
    const rect = (el: Element) => el.getBoundingClientRect()
    const fields = [...document.querySelectorAll("[data-slot=form-field]")]
    const controls = fields.map((f) => rect(f.querySelector("input,[data-slot=select-trigger]")!))
    const cells = fields.map((f) => rect(f))
    return { controls: controls.map((c) => ({ top: Math.round(c.top), w: Math.round(c.width) })), cells: cells.map((c) => Math.round(c.width)) }
  })
  // the first row has Nombre, División (short description) and Puntaje (long description): same top
  expect(m.controls[0]!.top).toBe(m.controls[1]!.top)
  expect(m.controls[1]!.top).toBe(m.controls[2]!.top)
  // every control, including the Select, fills the width of its cell
  m.controls.forEach((c, i) => expect(Math.abs(c.w - m.cells[i]!)).toBeLessThanOrEqual(1))
})

test("description lives in a help icon next to the label: hover shows it, click pins it, hit area is 40px", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 })
  await page.goto("/iframe.html?id=patterns-formgrid--with-select-and-descriptions&viewMode=story")
  const help = page.getByRole("button", { name: "Ayuda sobre División" })
  await help.waitFor()
  // the description is not shown (only a screen-reader copy exists) until the help is used
  await expect(page.getByRole("dialog")).toBeHidden()
  const after = await help.evaluate((el) => {
    const cs = getComputedStyle(el, "::after")
    return { w: parseFloat(cs.width), h: parseFloat(cs.height) }
  })
  expect(after.w).toBeGreaterThanOrEqual(40)
  expect(after.h).toBeGreaterThanOrEqual(40)
  await help.hover()
  await expect(page.getByRole("dialog")).toContainText("Opcional. Ej.: III, II, I.")
  await page.mouse.move(5, 5)
  await expect(page.getByRole("dialog")).toBeHidden()
  await help.click()
  await page.mouse.move(5, 5)
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
})
