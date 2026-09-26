import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)

    await user.click(screen.getByRole("button", { name: "Guardar" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Guardar
      </Button>
    )

    await user.click(screen.getByRole("button", { name: "Guardar" }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
