import type { Meta, StoryObj } from "@storybook/react-vite"
import { HouseIcon, UsersIcon, CalendarIcon } from "@phosphor-icons/react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "./sidebar"

const meta: Meta<typeof Sidebar> = {
  title: "Primitives/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {
  render: () => (
    <SidebarProvider className="min-h-[28rem]">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <span className="px-2 text-sm font-semibold">IIMP Eventos</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Inicio">
                    <HouseIcon />
                    <span>Inicio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Participantes">
                    <UsersIcon />
                    <span>Participantes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Agenda">
                    <CalendarIcon />
                    <span>Agenda</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <span className="px-2 text-xs text-muted-foreground">v0.1.0</span>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Panel</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Contenido de la página.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
}
