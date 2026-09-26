import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog"
import { Button } from "./button"

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Actualiza los datos del participante. Los cambios se guardan al confirmar.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Aquí va el contenido del diálogo (formulario, texto, etc.).
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
