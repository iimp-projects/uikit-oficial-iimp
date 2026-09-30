import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"

describe("Breadcrumb", () => {
  it("keeps a constrained trail on one line and truncates the current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Una ruta de navegación muy extensa</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Una página actual aún más extensa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )

    expect(screen.getByRole("list")).toHaveClass(
      "flex-nowrap",
      "overflow-hidden",
    )
    expect(screen.getByText("Una página actual aún más extensa")).toHaveClass(
      "truncate",
    )
  })
})
