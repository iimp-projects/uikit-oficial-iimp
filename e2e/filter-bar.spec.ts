import { expect, test } from "@playwright/test"

test("FilterBar lays search, selects and button in a single row on a wide container", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 800 })
  await page.goto("/iframe.html?id=patterns-filterbar--completo&viewMode=story")
  await page.waitForSelector("[data-slot=select-trigger]")
  const tops = await page.$$eval("input, [data-slot=select-trigger], button[type=button]:not([data-slot=select-trigger])", (els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2))
  )
  expect(tops.length).toBeGreaterThanOrEqual(5)
  expect(new Set(tops).size).toBe(1)
})
