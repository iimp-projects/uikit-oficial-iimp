import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { IimpThemeProvider } from "./IimpThemeProvider"

function foregroundFor(secondary: string) {
  const { container } = render(
    <IimpThemeProvider theme={{ primary: "#092042", secondary }}>x</IimpThemeProvider>
  )
  const el = container.querySelector<HTMLElement>("[data-slot=iimp-theme-provider]")!
  return el.style.getPropertyValue("--secondary-foreground")
}

describe("IimpThemeProvider contrast", () => {
  it("uses dark foreground on mid-tone gold (white gives ~2.9:1)", () => {
    expect(foregroundFor("#c09153")).toContain("0.2474")
  })
  it("uses light foreground on dark colors", () => {
    expect(foregroundFor("#092042")).toContain("0.985")
  })
})
