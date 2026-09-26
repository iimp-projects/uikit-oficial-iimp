import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandDialog,
} from "./command"
import { Button } from "./button"

const meta: Meta<typeof Command> = {
  title: "Primitives/Command",
  component: Command,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => (
    <Command className="w-80 border border-border">
      <CommandInput placeholder="Buscar evento o acción..." />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Eventos">
          <CommandItem>PERUMIN 2026</CommandItem>
          <CommandItem>ProEXPLO 2026</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem>Crear participante</CommandItem>
          <CommandItem>Exportar inscritos</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

export const ComoPaleta: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir command palette
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Buscar evento o acción..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup heading="Eventos">
              <CommandItem>PERUMIN 2026</CommandItem>
              <CommandItem>ProEXPLO 2026</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
}
