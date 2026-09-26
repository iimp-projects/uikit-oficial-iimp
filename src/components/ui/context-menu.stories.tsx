import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "./context-menu"

const meta: Meta<typeof ContextMenu> = {
  title: "Primitives/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        Click derecho aquí
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Fila</ContextMenuLabel>
        <ContextMenuItem>Ver detalle</ContextMenuItem>
        <ContextMenuItem>Editar</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Eliminar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
