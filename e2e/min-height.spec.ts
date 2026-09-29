import { expect, test } from "@playwright/test"

// Every interactive control (button, link, input, select…) is at least 40px tall.
// Documented exceptions, all still reachable at >= 40px via a larger hit area or an
// enclosing >= 40px control:
// - Checkbox/Radio/Switch: the visual box/track is small on purpose (that's the
//   established look for those controls), but each exposes an invisible `::after`
//   hit area of >= 40px, checked separately below.
// - `icon-xs` buttons (data-size="icon-xs"): only ever used nested fully inside an
//   already >= 40px field or chip (e.g. a combobox chip's remove glyph, an attachment
//   card's remove action), never as a standalone target on the page.
// - A bare `<input>`/`<select>` nested inside `[data-slot=input-group]`: the wrapping
//   InputGroup is the visible, clickable 40px surface and is checked in its own right;
//   the raw leaf keeps its natural (shorter) content height inside that padding.
// - A plain `<a>` inline inside a sentence/paragraph (e.g. "Acepto los Términos de Uso"):
//   WCAG 2.5.5 (AAA) itself exempts links within a block of text, since the target is the
//   whole line the text wraps to, not a fixed-size control.
const EXEMPT_SLOTS = new Set(["checkbox", "radio-group-item", "switch"])

type Entry = { id: string; type: string }

test("every interactive control on every story is >= 40px tall (min-height)", async ({ page, request }) => {
  test.setTimeout(300_000)
  const index = await (await request.get("/index.json")).json()
  const ids = (Object.values(index.entries) as Entry[])
    .filter((e) => e.type === "story" && /^(primitives|patterns)-/.test(e.id))
    .map((e) => e.id)

  const violations: string[] = []
  for (const id of ids) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`)
    await page.waitForSelector("#storybook-root > *, #storybook-docs > *", { timeout: 10_000 }).catch(() => {})
    await page.evaluate(() => document.fonts.ready)

    const found = await page.$$eval(
      "button,[role=button],[role=tab],[role=combobox],[role=switch],a[href],input:not([type=hidden]),select,[data-slot=breadcrumb-link]",
      (els) =>
        els
          .map((el) => {
            const r = el.getBoundingClientRect()
            const cs = getComputedStyle(el)
            const tag = el.tagName.toLowerCase()
            return {
              name: `${el.getAttribute("data-slot") ?? el.tagName}${el.getAttribute("data-size") ? ":" + el.getAttribute("data-size") : ""}`,
              slot: el.getAttribute("data-slot") ?? "",
              size: el.getAttribute("data-size") ?? "",
              h: Math.round(r.height),
              w: Math.round(r.width),
              inert: cs.pointerEvents === "none" || cs.opacity === "0" || cs.display === "none",
              nestedField: (tag === "input" || tag === "select") && !!el.closest("[data-slot=input-group]"),
              inlineLink: tag === "a" && !el.hasAttribute("data-slot") && !!el.closest("p, li, span"),
            }
          })
          .filter((x) => x.h > 1 && x.w > 1 && !x.inert)
    )
    for (const x of found) {
      if (EXEMPT_SLOTS.has(x.slot) || x.size === "icon-xs" || x.nestedField || x.inlineLink) continue
      if (x.h < 40) violations.push(`${id}: ${x.name} h=${x.h} (min 40)`)
    }
  }
  expect(violations, violations.join("\n")).toEqual([])
})

test("checkbox, radio and switch expose a >= 40px hit area via ::after", async ({ page }) => {
  await page.goto("/iframe.html?id=primitives-checkbox--default&viewMode=story")
  const checkbox = await page.locator("[data-slot=checkbox]").first().evaluate((el) => {
    const after = getComputedStyle(el, "::after")
    return { afterH: parseFloat(after.height) }
  })
  expect(checkbox.afterH).toBeGreaterThanOrEqual(40)

  await page.goto("/iframe.html?id=primitives-radiogroup--default&viewMode=story")
  const radio = await page.locator("[data-slot=radio-group-item]").first().evaluate((el) => {
    const after = getComputedStyle(el, "::after")
    return { afterH: parseFloat(after.height) }
  })
  expect(radio.afterH).toBeGreaterThanOrEqual(40)

  await page.goto("/iframe.html?id=primitives-switch--default&viewMode=story")
  const sw = await page.locator("[data-slot=switch]").first().evaluate((el) => {
    const after = getComputedStyle(el, "::after")
    return { afterH: parseFloat(after.height) }
  })
  expect(sw.afterH).toBeGreaterThanOrEqual(40)
})
