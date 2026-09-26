import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { axe } from "vitest-axe"
import { Button } from "./button"

describe("Button accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Button>Guardar</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
