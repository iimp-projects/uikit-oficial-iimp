import type { Meta, StoryObj } from "@storybook/react-vite"
import { ErrorState } from "./ErrorState"

const meta: Meta<typeof ErrorState> = {
  title: "Patterns/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ErrorState>

export const Page: Story = {
  args: {
    variant: "page",
    title: "No pudimos cargar el evento",
    description: "Ocurrió un problema al obtener la información. Intenta de nuevo.",
    retry: { label: "Reintentar", onClick: () => {} },
  },
}

export const Inline: Story = {
  args: {
    variant: "inline",
    title: "No se pudo cargar la lista de participantes",
    retry: { label: "Reintentar", onClick: () => {} },
  },
}
