import { expect, test } from "@playwright/test"

// Every icon glyph defaults to 24x24 (the default `size-6` token, applied wherever a consumer
// renders an icon without giving it its own size — via `[&_svg:not([class*='size-'])]:size-6` or
// the equivalent `[&>svg]`/`**:data-[slot=...]` selector, depending on the component).
//
// A handful of glyphs are intentionally smaller: bound inside an already-tiny, fixed-size element
// (Checkbox/Badge/Kbd/SidebarMenuAction) where 24px would overflow it, or decorative chrome next
// to a text label rather than "an icon" in the leading/trailing-icon sense (a disclosure caret, a
// breadcrumb separator/ellipsis). Every one of those is sized via a Tailwind arbitrary-selector
// utility (e.g. `[&>svg]:size-3.5`) that literally contains a `size-2`/`size-2.5`/`size-3`/`size-3.5`
// substring on the glyph itself or one of its ancestors — that's the signal this sweep uses: an SVG
// that renders under 24px with NONE of those size tokens anywhere up its ancestor chain is a real
// miss, not a documented exception.
const KNOWN_SMALL_SIZE_CLASSES = ["size-2", "size-2.5", "size-3", "size-3.5"]

type Entry = { id: string; type: string }

test("every icon glyph is >= 24x24 unless explicitly sized smaller on purpose", async ({ page, request }) => {
  test.setTimeout(300_000)
  await page.emulateMedia({ reducedMotion: "reduce" }) // avoid measuring mid-transition/scale glyphs
  const index = await (await request.get("/index.json")).json()
  const ids = (Object.values(index.entries) as Entry[])
    .filter((e) => e.type === "story" && /^(primitives|patterns)-/.test(e.id))
    .map((e) => e.id)

  const violations: string[] = []
  for (const id of ids) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`)
    await page.waitForSelector("#storybook-root > *, #storybook-docs > *", { timeout: 10_000 }).catch(() => {})

    const found = await page.$$eval("svg", (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect()
        let ancestorClasses = ""
        let node: Element | null = el
        for (let i = 0; i < 6 && node; i++) {
          ancestorClasses += " " + (node.getAttribute("class") ?? "")
          node = node.parentElement
        }
        return {
          ancestorClasses,
          h: Math.round(r.height),
          w: Math.round(r.width),
          slot: el.closest("[data-slot]")?.getAttribute("data-slot") ?? "svg",
        }
      })
    )
    for (const x of found) {
      if (x.h < 1 || x.w < 1) continue // hidden/not laid out
      const explicitlySized = KNOWN_SMALL_SIZE_CLASSES.some((c) => x.ancestorClasses.includes(c))
      if (explicitlySized) continue
      // 1px of tolerance: an absolutely-positioned, translate()-shifted glyph (MessageScrollerButton)
      // can report 23px instead of 24 due to sub-pixel rounding in that transform stack, not an
      // actual undersized icon (confirmed by reading its source: no size override below size-6).
      if (x.h < 23 || x.w < 23) violations.push(`${id}: ${x.slot} ${x.w}x${x.h}`)
    }
  }
  expect(violations, violations.join("\n")).toEqual([])
})
