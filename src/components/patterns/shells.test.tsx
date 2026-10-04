import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AppShell, type AppShellNavGroup } from "./AppShell"
import { LoginScreen } from "./LoginScreen"

const navigation: AppShellNavGroup[] = [
  { items: [{ title: "Dashboard", href: "/" }] },
  {
    label: "Pagos",
    items: [
      { title: "Procesamientos", href: "/pagos" },
      { title: "Constancias", href: "/pagos/constancias" },
      { title: "Pronto", href: "/pronto", disabled: true },
    ],
  },
]

function renderShell(
  currentPath: string,
  extra: Partial<React.ComponentProps<typeof AppShell>> = {},
) {
  return render(
    <AppShell
      brand={{ title: "IIMP Sistema", subtitle: "0.1.0" }}
      navigation={navigation}
      currentPath={currentPath}
      user={{ name: "Neill Rivera", email: "neill@iimp.org.pe" }}
      breadcrumbs={[{ label: "Sistema", href: "/" }, { label: "Dashboard" }]}
      {...extra}
    >
      <p>Contenido</p>
    </AppShell>,
  )
}

describe("AppShell", () => {
  it("renders brand, menu groups, user and page content", () => {
    renderShell("/")

    expect(screen.getByText("IIMP Sistema")).toBeInTheDocument()
    expect(screen.getByText("0.1.0")).toBeInTheDocument()
    expect(screen.getByText("Pagos")).toBeInTheDocument()
    expect(screen.getByText("Neill Rivera")).toBeInTheDocument()
    expect(screen.getByText("Contenido")).toBeInTheDocument()
  })

  it("marks only the longest matching item as the current page", () => {
    renderShell("/pagos/constancias")

    expect(screen.getByRole("link", { name: "Constancias" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(
      screen.getByRole("link", { name: "Procesamientos" }),
    ).not.toHaveAttribute("aria-current")
    expect(
      screen.getByRole("link", { name: "Procesamientos" }),
    ).not.toHaveAttribute("data-active")
  })

  it("matches the root item only on the root path", () => {
    renderShell("/pagos", { breadcrumbs: [{ label: "Sistema" }] })

    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    )
  })

  it("renders disabled items without a link", () => {
    renderShell("/")

    expect(
      screen.queryByRole("link", { name: "Pronto" }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Pronto" })).toBeDisabled()
  })

  it("shows the sign-out button only when a handler is provided", async () => {
    const onSignOut = vi.fn()
    const { unmount } = renderShell("/")
    expect(
      screen.queryByRole("button", { name: "Cerrar sesión" }),
    ).not.toBeInTheDocument()
    unmount()

    renderShell("/", { onSignOut })
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }))
    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it("renders the breadcrumb trail with the last item as the current page", () => {
    renderShell("/")

    expect(screen.getByRole("link", { name: "Sistema" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(
      screen.getByText("Dashboard", { selector: "[aria-current='page']" }),
    ).toBeInTheDocument()
  })
})

describe("LoginScreen", () => {
  const base = {
    systemName: "IIMP Sistema",
    headline: "Titular",
    subtitle: "Ingresa con tu correo corporativo.",
  }

  it("renders the card, the default title and the legal links", () => {
    render(
      <LoginScreen
        {...base}
        legal={{ privacyHref: "/privacidad", termsHref: "/terminos" }}
      />,
    )

    expect(
      screen.getByRole("heading", { name: "Iniciar Sesión" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Continuar con Google" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Políticas de Privacidad" }),
    ).toHaveAttribute("href", "/privacidad")
    expect(
      screen.getByRole("link", { name: "Términos de Uso" }),
    ).toHaveAttribute("href", "/terminos")
  })

  it("calls onSignIn and shows the loading state", async () => {
    const onSignIn = vi.fn()
    const { rerender } = render(<LoginScreen {...base} onSignIn={onSignIn} />)
    await userEvent.click(
      screen.getByRole("button", { name: "Continuar con Google" }),
    )
    expect(onSignIn).toHaveBeenCalledTimes(1)

    rerender(<LoginScreen {...base} onSignIn={onSignIn} loading />)
    expect(screen.getByRole("button", { name: "Conectando…" })).toBeDisabled()
  })

  it("shows an error alert and submits through a form when action is provided", () => {
    render(
      <LoginScreen
        {...base}
        action="/api/auth/google"
        error="No pudimos completar el ingreso."
      />,
    )

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No pudimos completar el ingreso.",
    )
    expect(
      screen.getByRole("button", { name: "Continuar con Google" }),
    ).toHaveAttribute("type", "submit")
  })
})
