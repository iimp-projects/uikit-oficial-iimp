import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "./menubar"

const meta: Meta<typeof Menubar> = {
  title: "Primitives/Menubar",
  component: Menubar,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Menubar>

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Archivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Nuevo evento <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Duplicar</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Eliminar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Deshacer</MenubarItem>
          <MenubarItem>Rehacer</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}
