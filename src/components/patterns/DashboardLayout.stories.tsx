import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Certificate,
  Files,
  PaperPlaneTilt,
  Plus,
  SquaresFour,
  Stack,
  UsersThree,
} from "@phosphor-icons/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { Button } from "../ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar"
import {
  DashboardHeader,
  DashboardLayout,
  DashboardNotifications,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  DashboardVersion,
  type DashboardSidebarTone,
} from "./DashboardLayout"
import { LanguageSwitcher } from "./LanguageSwitcher"

const meta: Meta<typeof DashboardLayout> = {
  title: "Patterns/DashboardLayout",
  component: DashboardLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    sidebarTone: {
      control: "inline-radio",
      options: ["primary", "secondary", "base"],
    },
  },
}
export default meta

type Story = StoryObj<typeof DashboardLayout>

const navigation = [
  { label: "Dashboard", icon: SquaresFour, active: true },
  { label: "Procesamientos", icon: Files },
  { label: "Constancias", icon: Certificate },
  { label: "Proveedores", icon: UsersThree },
  { label: "Envíos", icon: PaperPlaneTilt },
  { label: "Plantillas", icon: Stack },
]

function DemoSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <DashboardSidebarBrand
        title="IIMP Tesorería"
        description="Gestión de Detracciones"
      />
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-2 font-semibold uppercase tracking-widest">
            Módulos principales
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navigation.map(({ label, icon: Icon, active }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton isActive={active} tooltip={label}>
                    <Icon aria-hidden="true" weight={active ? "fill" : "regular"} />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <DashboardSidebarUser
        name="Tesorero Operaciones"
        email="tesoreria@iimp.org.pe"
        onSignOut={() => {}}
      />
      <SidebarRail />
    </Sidebar>
  )
}

function DashboardDemo({ sidebarTone }: { sidebarTone: DashboardSidebarTone }) {
  return (
    <DashboardLayout
      sidebarTone={sidebarTone}
      sidebar={<DemoSidebar />}
      header={
        <DashboardHeader
          navigation={
            <Breadcrumb className="hidden min-w-0 flex-1 sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>Tesorería</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
          status={<DashboardVersion version="0.0.1" />}
          languageSwitcher={<LanguageSwitcher languages={["es", "en", "qu"]} />}
          notifications={<DashboardNotifications />}
          actions={
            <Button aria-label="Cargar PDF">
              <Plus data-icon="inline-start" weight="bold" />
              <span className="hidden sm:inline">Cargar PDF</span>
            </Button>
          }
        />
      }
    >
      {null}
    </DashboardLayout>
  )
}

export const Default: Story = {
  args: { sidebarTone: "primary" },
  render: ({ sidebarTone = "primary" }) => <DashboardDemo sidebarTone={sidebarTone} />,
}

export const SecondarySidebar: Story = {
  render: () => <DashboardDemo sidebarTone="secondary" />,
}

export const BaseSidebar: Story = {
  render: () => <DashboardDemo sidebarTone="base" />,
}
