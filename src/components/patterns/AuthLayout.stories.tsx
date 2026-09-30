import type { Meta, StoryObj } from "@storybook/react-vite"
import { AuthLayout } from "./AuthLayout"
import { GoogleSignInButton } from "../ui/google-sign-in-button"
import { Card, CardContent, CardHeader } from "../ui/card"
// Shared institutional asset. DashboardSidebarBrand references it from the public entry, so it is
// emitted into dist and available to consumers of the published package.
import logoIimp from "./assets/logo-iimp.png"

const meta: Meta<typeof AuthLayout> = {
  title: "Patterns/AuthLayout",
  component: AuthLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    brandTone: {
      control: "inline-radio",
      options: ["primary", "secondary"],
    },
  },
}
export default meta

type Story = StoryObj<typeof AuthLayout>

// Card copy: kept as plain values here so it's obvious this is app-owned content, not
// AuthLayout props — swap these for the real project's copy.
const cardTitle = "Iniciar Sesión"
const cardDescription = "Ingresa utilizando tu correo corporativo (@iimp.org.pe)."

// Recipe: AuthLayout owns the two-column shell and the brand panel. The right side (the actual
// login card, its copy and its sign-in control) is composed by the app — this is a working example,
// not a fixed component, since that copy differs per project. No auth is wired: GoogleSignInButton
// is a plain button; give it your own onClick/formAction (NextAuth, a Server Action, Firebase…).
export const Default: Story = {
  args: { brandTone: "primary" },
  render: ({ brandTone = "primary" }) => (
    <AuthLayout
      brandTone={brandTone}
      systemName="Nombre del sistema"
      systemTagline="Del PDF masivo de SUNAT a la constancia individual, en minutos"
      eyebrow="Módulo o producto"
      headline="Un resumen breve de lo que hace este sistema."
      description="Una o dos frases sobre el problema que resuelve y para quién es. Este panel es solo visual — reemplázalo por el copy real del proyecto."
      features={["Beneficio o capacidad clave", "Otra capacidad relevante", "Tercer punto, si aplica"]}
      footer={`© ${new Date().getFullYear()} Instituto de Ingenieros de Minas del Perú`}
    >
      <Card className="shadow-xl">
        <CardHeader>
          <div className="relative flex flex-col items-center justify-center gap-3">
            <img src={logoIimp} alt="Instituto de Ingenieros de Minas del Perú" className="h-14 w-auto" />
            <div>
              <div className="text-center font-heading text-lg font-semibold leading-tight">{cardTitle}</div>
              <div className="mt-1 text-center text-sm text-muted-foreground">{cardDescription}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <GoogleSignInButton className="text-base font-bold shadow-sm hover:shadow-md" onClick={() => {}} />
          <p className="text-center text-muted-foreground">
            Al continuar, aceptas nuestras{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">
              Políticas de Privacidad
            </a>{" "}
            y{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">
              Términos de Uso
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  ),
}

export const SecondaryBrandPanel: Story = {
  ...Default,
  args: { brandTone: "secondary" },
}
