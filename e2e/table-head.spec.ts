import { expect, test } from "@playwright/test"

// Regla del kit: toda cabecera de tabla usa font-size 12px y font-weight bolder.
test("table headers are 12px and bolder than the body text", async ({ page, request }) => {
  const index = await (await request.get("/index.json")).json()
  const ids = (Object.values(index.entries) as { id: string; type: string }[])
    .filter((e) => e.type === "story" && /^(primitives-table|patterns-datatable)/.test(e.id))
    .map((e) => e.id)
  expect(ids.length).toBeGreaterThan(0)
  for (const id of ids) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`)
    await page.waitForSelector("[data-slot=table-head]", { timeout: 10_000 })
    const heads = await page.$$eval("[data-slot=table-head]", (els) =>
      els.map((el) => {
        const cs = getComputedStyle(el)
        const cell = el.closest("table")?.querySelector("[data-slot=table-cell]")
        return { size: cs.fontSize, weight: parseInt(cs.fontWeight, 10), cellWeight: cell ? parseInt(getComputedStyle(cell).fontWeight, 10) : 400 }
      })
    )
    for (const h of heads) {
      expect(h.size, id).toBe("12px")
      expect(h.weight, id).toBeGreaterThan(h.cellWeight)
    }
  }
})

test("sidebar brand logo is 35px high with automatic width", async ({ page }) => {
  await page.goto("/iframe.html?id=patterns-dashboardlayout--default&viewMode=story")
  await page.setViewportSize({ width: 1400, height: 900 })
  const box = await page.locator("[data-slot=dashboard-sidebar-brand] img").first().boundingBox()
  expect(Math.round(box!.height)).toBe(35)
  expect(box!.width).toBeLessThan(35)
})
