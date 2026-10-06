import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { FormField } from "./FormField"
import { Input } from "../ui/input"

describe("FormField description", () => {
  it("moves the description into a help popover next to the label", async () => {
    render(
      <FormField label="Código" description="Opcional. Único.">
        <Input />
      </FormField>
    )
    const help = screen.getByRole("button", { name: "Ayuda sobre Código" })
    expect(screen.getByLabelText("Código")).toBeInTheDocument()
    // nothing visible until the help is opened
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    await userEvent.click(help)
    expect(await screen.findByRole("dialog")).toHaveTextContent("Opcional. Único.")
    await userEvent.click(help)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("keeps the description available to assistive tech through aria-describedby", () => {
    render(
      <FormField label="Código" description="Opcional. Único.">
        <Input />
      </FormField>
    )
    const input = screen.getByLabelText("Código")
    const describedBy = input.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent("Opcional. Único.")
  })

  it("renders no help icon without a description", () => {
    render(
      <FormField label="Nombre" required>
        <Input />
      </FormField>
    )
    expect(screen.queryByRole("button", { name: /Ayuda/ })).not.toBeInTheDocument()
  })
})
