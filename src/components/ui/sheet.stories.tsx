import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./sheet"
import { Button } from "./button"

const meta: Meta<typeof Sheet> = {
  title: "Primitives/Sheet",
  component: Sheet,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir panel</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Ajusta los filtros para la lista de participantes.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-6 text-sm text-muted-foreground">
          Aquí van los controles del panel (filtros, formulario, etc.).
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button>Aplicar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const DesdeLaIzquierda: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir menú</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navegación</SheetTitle>
          <SheetDescription>Menú lateral del producto.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
