import type { Meta, StoryObj } from "@storybook/react-vite"
import { LoginScreen } from "./LoginScreen"

const meta: Meta<typeof LoginScreen> = {
  title: "Armazón/Login",
  component: LoginScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pantalla de inicio completa: panel de marca, card con logo, botón de Google, error y enlaces legales. La app solo pone el texto y la función de ingreso (`onSignIn` o `action`). Sin autenticación incluida.",
      },
    },
  },
  argTypes: {
    brandTone: { control: "inline-radio", options: ["primary", "secondary"] },
  },
}
export default meta

type Story = StoryObj<typeof LoginScreen>

export const Default: Story = {
  args: {
    systemName: "IIMP Sistema",
    systemTagline: "Instituto de Ingenieros de Minas del Perú",
    eyebrow: "Módulo o producto",
    headline: "Resumen breve de lo que hace el sistema.",
    description:
      "Una o dos frases sobre el problema que resuelve y para quién es.",
    features: [
      "Beneficio o capacidad clave",
      "Otra capacidad relevante",
      "Tercer punto, si aplica",
    ],
    footer: "© 2026 Instituto de Ingenieros de Minas del Perú",
    subtitle: "Ingresa utilizando tu correo corporativo (@iimp.org.pe).",
    legal: { privacyHref: "#", termsHref: "#" },
    onSignIn: () => {},
  },
}

export const Cargando: Story = { args: { ...Default.args, loading: true } }

export const ConError: Story = {
  args: {
    ...Default.args,
    error: "Usa tu cuenta corporativa de Google (@iimp.org.pe).",
  },
}

export const PanelSecundario: Story = {
  args: { ...Default.args, brandTone: "secondary" },
}
