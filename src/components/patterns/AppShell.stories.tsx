import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Certificate,
  Files,
  GearSix,
  PaperPlaneTilt,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react"
import { AppShell, type AppShellNavGroup } from "./AppShell"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { PageHeader } from "./PageHeader"

const meta: Meta<typeof AppShell> = {
  title: "Armazón/Dashboard",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Armazón autenticado completo: marca con versión, menú agrupado con íconos, usuario con cierre de sesión, header con breadcrumb, idioma y notificaciones. La app solo pasa el menú (`navigation`), el usuario y el contenido (`children`). Con `children` vacío el main queda vacío.",
      },
    },
  },
  argTypes: {
    sidebarTone: {
      control: "inline-radio",
      options: ["primary", "secondary", "base"],
    },
  },
}
export default meta

type Story = StoryObj<typeof AppShell>

const navigation: AppShellNavGroup[] = [
  { items: [{ title: "Dashboard", href: "/", icon: <SquaresFour /> }] },
  {
    label: "Detracciones SUNAT",
    items: [
      { title: "Procesamientos", href: "/procesamientos", icon: <Files /> },
      { title: "Constancias", href: "/constancias", icon: <Certificate /> },
      { title: "Envíos", href: "/envios", icon: <PaperPlaneTilt /> },
    ],
  },
  {
    label: "Configuraciones",
    items: [
      {
        title: "Proveedores",
        href: "/proveedores",
        icon: <UsersThree />,
        badge: 3,
      },
      {
        title: "Parámetros",
        href: "/parametros",
        icon: <GearSix />,
        disabled: true,
      },
    ],
  },
]

const base = {
  brand: { title: "IIMP Sistema", subtitle: "0.1.0" },
  navigation,
  currentPath: "/",
  user: { name: "Neill Rivera", email: "neill.rivera@iimp.org.pe" },
  breadcrumbs: [
    { label: "Sistema", href: "/" },
    { label: "Dashboard general" },
  ],
  languageSwitcher: (
    <LanguageSwitcher languages={["es", "en"]} defaultValue="es" />
  ),
  onSignOut: () => {},
}

/** Estado inicial de un proyecto nuevo: armazón completo y main vacío. */
export const MainVacio: Story = { args: base }

export const ConContenido: Story = {
  args: base,
  render: (args) => (
    <AppShell {...args}>
      <PageHeader
        title="Dashboard general"
        description="Reemplaza este contenido por el de tu producto."
      />
      <p className="text-muted-foreground">Tu contenido va aquí.</p>
    </AppShell>
  ),
}

export const ItemActivoAnidado: Story = {
  args: { ...base, currentPath: "/constancias" },
}

export const SidebarSecundario: Story = {
  args: { ...base, sidebarTone: "secondary" },
}
