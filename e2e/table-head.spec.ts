import { expect, test } from "@playwright/test"

// Regla del kit: toda cabecera de tabla usa la tipografía oficial: misma familia que el cuerpo
// (Manrope, nunca una fuente de respaldo como serif), 13px, peso 600, MAYÚSCULAS y color muted.
test("table headers are uppercase Manrope 600 / 13px, same family as the body", async ({ page, request }) => {
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
        return { size: cs.fontSize, weight: cs.fontWeight, transform: cs.textTransform, family: cs.fontFamily, bodyFamily: getComputedStyle(document.body).fontFamily }
      })
    )
    for (const h of heads) {
      expect(h.family, id).toContain("Manrope")
      expect(h.family, id).toBe(h.bodyFamily)
      expect(h.size, id).toBe("13px")
      expect(h.weight, id).toBe("600")
      expect(h.transform, id).toBe("uppercase")
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
