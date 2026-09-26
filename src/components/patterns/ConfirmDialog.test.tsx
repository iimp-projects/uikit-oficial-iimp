import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ConfirmDialog } from "./ConfirmDialog"
import { Button } from "../ui/button"

describe("ConfirmDialog", () => {
  it("opens on trigger click and shows title/description", async () => {
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        trigger={<Button>Cerrar inscripciones</Button>}
        title="Cerrar inscripciones"
        description="No se podrán registrar nuevos participantes."
        confirmLabel="Cerrar inscripciones"
        onConfirm={() => {}}
      />
    )

    await user.click(screen.getByRole("button", { name: "Cerrar inscripciones" }))

    expect(screen.getByRole("heading", { name: "Cerrar inscripciones" })).toBeInTheDocument()
    expect(
      screen.getByText("No se podrán registrar nuevos participantes.")
    ).toBeInTheDocument()
  })

  it("calls onConfirm when the confirm action is clicked", async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        trigger={<Button>Abrir</Button>}
        title="Título"
        description="Descripción"
        confirmLabel="Confirmar"
        onConfirm={onConfirm}
      />
    )

    await user.click(screen.getByRole("button", { name: "Abrir" }))
    await user.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
