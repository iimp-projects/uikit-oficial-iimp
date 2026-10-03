import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet"

// bg-secondary must always travel with text-secondary-foreground (AGENTS.md / UX rules).
describe("close buttons use the secondary token pair", () => {
  it("DialogContent close button", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>t</DialogTitle>
          <DialogDescription>d</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    const close = screen.getByRole("button", { name: "Close" })
    expect(close).toHaveClass("bg-secondary", "text-secondary-foreground")
    expect(close.className).not.toMatch(/(^|\s)hover:bg-muted/)
  })

  it("SheetContent close button", () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>t</SheetTitle>
          <SheetDescription>d</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    const close = screen.getByRole("button", { name: "Close" })
    expect(close).toHaveClass("bg-secondary", "text-secondary-foreground")
    expect(close.className).not.toMatch(/(^|\s)hover:bg-muted/)
  })
})
