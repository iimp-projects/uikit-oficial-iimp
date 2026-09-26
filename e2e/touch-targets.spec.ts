import { expect, test } from "@playwright/test"

// docs/03_UX_RULES.md: interactive targets >= 44px. Compact variants (Button sm / icon-sm, 36px)
// are allowed for dense desktop contexts. Switch keeps a small visual with a 44px pseudo-element hit area.
const MIN = 44
const COMPACT_MIN = 36
const COMPACT_INSIDE_CONTROL_MIN = 24 // icon-xs inside an already-44px input group (WCAG 2.5.8 AA)
const SELECTOR =
  "button,[role=button],[role=checkbox],[role=radio],[role=tab],[role=combobox],input:not([type=hidden]):not([data-slot=questionnaire-choice-input]),select,a[href]"

type Entry = { id: string; type: string }

test("all primitive/pattern interactive targets meet size rules", async ({ page, request }) => {
  test.setTimeout(300_000)
  const index = await (await request.get("/index.json")).json()
  const ids = (Object.values(index.entries) as Entry[])
    .filter((e) => e.type === "story" && /^(primitives|patterns)-/.test(e.id))
    .map((e) => e.id)

  await page.emulateMedia({ reducedMotion: "reduce" })
  const violations: string[] = []
  for (const id of ids) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`)
    await page.waitForSelector("#storybook-root > *, #storybook-docs > *", { timeout: 10_000 }).catch(() => {})
    await page.evaluate(() => document.fonts.ready)
    const found = await page.$$eval(SELECTOR, (els) =>
      els
        .map((el) => {
          const group = el.closest("[data-slot=input-group]")
          const r = (group ?? el).getBoundingClientRect()
          const cs = getComputedStyle(el)
          const inert = cs.pointerEvents === "none" || cs.opacity === "0"
          const size = el.getAttribute("data-size")
          // Small visuals (checkbox/radio/switch) expose a 44px hit area through ::after.
          const after = getComputedStyle(el, "::after")
          const ah = after.position === "absolute" ? parseFloat(after.height) || 0 : 0
          const aw = after.position === "absolute" ? parseFloat(after.width) || 0 : 0
          return {
            name: `${el.getAttribute("data-slot") ?? el.tagName}${size ? ":" + size : ""}`,
            compact: size === "sm" || size === "icon-sm",
            tiny: size === "icon-xs" || size === "xs",
            w: Math.round(Math.max(r.width, aw)),
            h: Math.round(Math.max(r.height, ah)),
            inert,
            inline: el.tagName === "A" && !el.hasAttribute("data-slot") && !!el.closest("p,li,span"),
          }
        })
        .filter((x) => x.w > 1 && x.h > 1 && !x.inline && !x.inert)
    )
    for (const x of found) {
      const min = x.tiny ? COMPACT_INSIDE_CONTROL_MIN : x.compact ? COMPACT_MIN : MIN
      if (x.h < min || x.w < min) violations.push(`${id}: ${x.name} ${x.w}x${x.h} (min ${min})`)
    }
  }
  expect(violations, violations.join("\n")).toEqual([])
})

// Brand pair #c09153 on #f2e8dd is ~2.4:1. Fails AA 4.5:1 for normal text. Re-enable when brand approves a darker foreground.
test.fixme("secondary button foreground has WCAG AA contrast", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--secondary&viewMode=story")
  const ratio = await page.locator("[data-slot=button]").evaluate((el) => {
    const parse = (c: string) => {
      const cv = document.createElement("canvas").getContext("2d")!
      cv.fillStyle = "#000"
      cv.fillStyle = c
      cv.fillRect(0, 0, 1, 1)
      return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3)
    }
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const s = getComputedStyle(el)
    const [a, b] = [lum(parse(s.color)), lum(parse(s.backgroundColor))]
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  })
  expect(ratio).toBeGreaterThanOrEqual(4.5)
})

test("buttons use the system-ui stack at weight 500", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--default&viewMode=story")
  const s = await page.locator("[data-slot=button]").first().evaluate((el) => {
    const c = getComputedStyle(el)
    return { ff: c.fontFamily, fw: c.fontWeight }
  })
  expect(s.ff).toContain("system-ui")
  expect(s.fw).toBe("500")
})

test("default radius is 10px on controls", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--default&viewMode=story")
  const r = await page.locator("[data-slot=button]").first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
  expect(r).toBe("10px")
})

test("secondary uses brand pair #c09153 on #f2e8dd", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--secondary&viewMode=story")
  const c = await page.locator("[data-slot=button]").first().evaluate((el) => {
    const s = getComputedStyle(el)
    return { color: s.color, bg: s.backgroundColor }
  })
  expect(c.bg).toBe("rgb(242, 232, 221)")
  expect(c.color).toBe("rgb(192, 145, 83)")
})

for (const [id, item, trigger] of [
  ["primitives-dropdownmenu--default", "[role=menuitem]", "[data-slot=dropdown-menu-trigger]"],
  ["primitives-menubar--default", "[role=menuitem]", "[data-slot=menubar-trigger]"],
  ["primitives-select--default", "[role=option]", "[data-slot=select-trigger]"],
] as const) {
  test(`open menu items meet 44px: ${id}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(`/iframe.html?id=${id}&viewMode=story`)
    await page.locator(trigger).first().click()
    const items = page.locator(item)
    await items.first().waitFor()
    const heights = await items.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)))
    expect(heights.length).toBeGreaterThan(0)
    for (const h of heights) expect(h).toBeGreaterThanOrEqual(44)
  })
}

test("body and heading typography follow brand spec", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-button--default&viewMode=story")
  const t = await page.evaluate(() => {
    const mk = (tag: string) => {
      const el = document.createElement(tag)
      el.textContent = "x"
      document.body.appendChild(el)
      const c = getComputedStyle(el)
      return { ff: c.fontFamily, fw: c.fontWeight, fs: c.fontSize, lh: c.lineHeight }
    }
    return { p: mk("p"), h1: mk("h1") }
  })
  expect(t.p).toMatchObject({ fw: "400", fs: "14px", lh: "24px" })
  expect(t.p.ff).toContain("system-ui")
  expect(t.h1).toMatchObject({ fw: "600", fs: "30px", lh: "36px" })
  expect(t.h1.ff).toContain("system-ui")
})
