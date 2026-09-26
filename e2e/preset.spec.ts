import { expect, test } from "@playwright/test"

// The kit follows shadcn preset b1aIuQ2XC (luma). Only primary and secondary are IIMP brand colors.

test("primary button uses the IIMP primary color", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--default&viewMode=story")
  const c = await page.locator("[data-slot=button]").first().evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(c).toBe("rgb(9, 32, 66)")
})

test("secondary button uses the brand pair #c09153 on #f2e8dd", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--secondary&viewMode=story")
  const c = await page.locator("[data-slot=button]").first().evaluate((el) => {
    const s = getComputedStyle(el)
    return { color: s.color, bg: s.backgroundColor }
  })
  expect(c.bg).toBe("rgb(242, 232, 221)")
  expect(c.color).toBe("rgb(192, 145, 83)")
})

test("preset radius and Apple typography (SF Pro Text / SF Pro Display)", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-input--default&viewMode=story")
  const s = await page.locator("[data-slot=input]").first().evaluate((el) => {
    const c = getComputedStyle(el)
    return { r: c.borderTopLeftRadius, ff: c.fontFamily, radius: getComputedStyle(document.documentElement).getPropertyValue("--radius").trim() }
  })
  expect(s.ff).toContain("SF Pro Text")
  expect(s.radius).toBe("0.875rem")
})

test("card is solid white", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-card--default&viewMode=story")
  const bg = await page.locator("[data-slot=card]").first().evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(["rgb(255, 255, 255)", "oklch(1 0 0)"]).toContain(bg)
})

test("provider retints primary and derived tokens at runtime", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--default&viewMode=story")
  await page.waitForSelector("[data-slot=button]")
  const c = await page.evaluate(async () => {
    const w = document.querySelector("[data-slot=iimp-theme-provider]") as HTMLElement
    w.style.setProperty("--primary", "#1b4332")
    await new Promise((r) => setTimeout(r, 600))
    return getComputedStyle(document.querySelector("[data-slot=button]")!).backgroundColor
  })
  expect(c).toBe("rgb(27, 67, 50)")
})

test("titles use SF Pro Display and are at least 20px; UI text is at least 13px", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-card--default&viewMode=story")
  const t = await page.locator("[data-slot=card-title]").first().evaluate((el) => {
    const c = getComputedStyle(el)
    return { ff: c.fontFamily, fs: parseFloat(c.fontSize) }
  })
  expect(t.ff).toContain("SF Pro Display")
  expect(t.fs).toBeGreaterThanOrEqual(20)
  const small = await page.$$eval("#storybook-root *", (els) =>
    els
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()))
      .map((el) => parseFloat(getComputedStyle(el).fontSize))
      .filter((f) => f < 13)
  )
  expect(small).toEqual([])
})
