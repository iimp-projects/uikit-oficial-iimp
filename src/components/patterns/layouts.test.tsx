import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Sidebar, SidebarContent, SidebarMenuButton } from "../ui/sidebar"
import { AuthLayout } from "./AuthLayout"
import {
  DashboardHeader,
  DashboardLayout,
  DashboardNotifications,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  DashboardVersion,
} from "./DashboardLayout"
import { LanguageSwitcher } from "./LanguageSwitcher"

describe("AuthLayout", () => {
  it("uses the primary brand surface by default", () => {
    const { container } = render(
      <AuthLayout systemName="Sistema" headline="Bienvenido">
        <div>Login</div>
      </AuthLayout>
    )

    const surfaces = container.querySelectorAll('[data-brand-tone="primary"]')
    expect(surfaces).toHaveLength(2)
    expect(surfaces[0]).toHaveClass("bg-primary", "text-primary-foreground")
  })

  it("can use the secondary token pair", () => {
    const { container } = render(
      <AuthLayout brandTone="secondary" systemName="Sistema" headline="Bienvenido">
        <div>Login</div>
      </AuthLayout>
    )

    const surfaces = container.querySelectorAll('[data-brand-tone="secondary"]')
    expect(surfaces).toHaveLength(2)
    expect(surfaces[0]).toHaveClass("bg-secondary", "text-secondary-foreground")
  })
})

describe("DashboardLayout", () => {
  it("renders a standard shell and retints sidebar tokens", () => {
    const { container } = render(
      <DashboardLayout
        sidebarTone="secondary"
        sidebar={
          <Sidebar>
            <SidebarContent>Navigation</SidebarContent>
          </Sidebar>
        }
        header={<DashboardHeader navigation="Dashboard" />}
      >
        Page content
      </DashboardLayout>
    )

    expect(screen.getByRole("main")).toHaveTextContent("Page content")
    expect(screen.getByRole("banner")).toHaveTextContent("Dashboard")
    expect(screen.getByRole("button", { name: "Mostrar u ocultar menú" })).toBeInTheDocument()

    const wrapper = container.querySelector('[data-sidebar-tone="secondary"]')
    expect(wrapper).toHaveStyle({
      "--sidebar": "var(--secondary)",
      "--sidebar-foreground": "var(--secondary-foreground)",
    })
  })

  it("aligns the desktop header and closes the sidebar completely", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DashboardLayout
        sidebar={
          <Sidebar collapsible="offcanvas">
            <DashboardSidebarBrand title="IIMP Tesorería" description="Gestión" />
            <SidebarContent>
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </SidebarContent>
          </Sidebar>
        }
        header={<DashboardHeader navigation="Dashboard" />}
      >
        {null}
      </DashboardLayout>
    )

    expect(container.querySelector('[data-slot="dashboard-sidebar-brand"]')).toHaveClass("h-20")
    expect(screen.getByRole("img", { name: "IIMP Tesorería" })).toBeInTheDocument()
    expect(screen.getByRole("banner")).toHaveClass("sm:h-20")
    expect(screen.getByRole("button", { name: "Dashboard" })).toHaveClass(
      "h-11",
      "rounded-[var(--sidebar-menu-radius)]"
    )

    await user.click(screen.getByRole("button", { name: "Mostrar u ocultar menú" }))
    expect(container.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
      "data-collapsible",
      "offcanvas"
    )
  })

  it("renders user identity and delegates sign out", async () => {
    const user = userEvent.setup()
    const onSignOut = vi.fn()

    render(
      <DashboardSidebarUser
        name="Tesorero Operaciones"
        email="tesoreria@iimp.org.pe"
        onSignOut={onSignOut}
      />
    )

    expect(screen.getByText("Tesorero Operaciones")).toBeInTheDocument()
    expect(screen.getByText("tesoreria@iimp.org.pe")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }))
    expect(onSignOut).toHaveBeenCalledOnce()
  })

  it("opens the notifications dropdown", async () => {
    const user = userEvent.setup()
    render(<DashboardNotifications />)

    await user.click(screen.getByRole("button", { name: "Notificaciones" }))
    expect(screen.getByText("Todo al día. No hay alertas pendientes.")).toBeVisible()
  })

  it("formats the dashboard version consistently", () => {
    render(<DashboardVersion version="0.0.1" />)

    expect(screen.getByText("v0.0.1")).toBeInTheDocument()
  })
})

describe("LanguageSwitcher", () => {
  it("creates one control per injected locale and reports the selection", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <LanguageSwitcher
        languages={[
          { code: "es", ariaLabel: "Español" },
          { code: "en", ariaLabel: "English" },
          { code: "qu", ariaLabel: "Quechua" },
        ]}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Seleccionar idioma: ES" }))
    expect(screen.getByRole("menuitemradio", { name: "Español" })).toHaveAttribute("data-state", "checked")
    await user.click(screen.getByRole("menuitemradio", { name: "English" }))

    expect(onValueChange).toHaveBeenCalledWith("en")
    expect(screen.getByRole("button", { name: "Seleccionar idioma: EN" })).toBeInTheDocument()
  })

  it("syncs and writes the legacy Google Translate cookie when enabled", async () => {
    const user = userEvent.setup()
    document.cookie = "googtrans=/es/en; path=/"

    render(
      <LanguageSwitcher
        languages={[
          { code: "es", ariaLabel: "Español" },
          { code: "en", ariaLabel: "English" },
          { code: "qu", ariaLabel: "Quechua" },
        ]}
        googleTranslate={{ loadScript: false, reload: false }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Seleccionar idioma: EN" })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "Seleccionar idioma: EN" }))
    await user.click(screen.getByRole("menuitemradio", { name: "Quechua" }))
    expect(document.cookie).toContain("googtrans=/es/qu")
  })
})
