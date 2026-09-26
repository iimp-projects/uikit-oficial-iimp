/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { render, cleanup } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { composeStories, setProjectAnnotations } from "@storybook/react-vite"
import preview from "../.storybook/preview"
import { axe } from "vitest-axe"

// Smoke + a11y coverage for every story: each must render without throwing and without axe violations.
const modules = (import.meta as ImportMeta & { glob: (p: string, o: object) => Record<string, unknown> }).glob("./**/*.stories.tsx", { eager: true }) as Record<string, any>

setProjectAnnotations(preview as any)
afterEach(cleanup)

// Rules that need real layout/color engines (jsdom cannot compute them). Contrast and sizes are covered in e2e.
const AXE_OPTIONS = { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } }

// Known third-party false positive: cmdk wraps options in a role-less <div cmdk-list-sizer> inside role=listbox.
const KNOWN_AXE: Record<string, string[]> = { "./components/ui/command.stories.tsx": ["aria-required-children"] }

describe.each(Object.entries(modules))("%s", (path, mod) => {
  if (!mod.default?.title && !mod.default?.component) return
  const stories = composeStories(mod) as Record<string, React.ComponentType>
  it.each(Object.entries(stories))("%s renders and has no axe violations", async (_name, Story) => {
    const { container } = render(<Story />)
    expect(container).toBeTruthy()
    await new Promise((r) => setTimeout(r, 50)) // let async-mounting libs (cmdk, base-ui) settle
    const results = await axe(container, AXE_OPTIONS as any)
    const ignored = KNOWN_AXE[path] ?? []
    const found = results.violations.filter((v) => !ignored.includes(v.id)).map((v) => `${v.id} (${v.nodes[0]?.target}) ${v.nodes[0]?.html.slice(0, 160)}`)
    if (found.length) throw new Error("AXE " + found.join(" | "))
  })
})
