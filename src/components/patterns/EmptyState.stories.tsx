import type { Meta, StoryObj } from "@storybook/react-vite"
import { UsersIcon } from "@phosphor-icons/react"
import { EmptyState } from "./EmptyState"

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  render: () => (
    <EmptyState
      media={<UsersIcon className="size-10" />}
      title="Aún no hay participantes"
      description="Los participantes que se inscriban al evento aparecerán aquí."
      primaryAction={{ label: "Invitar participantes", onClick: () => {} }}
      secondaryAction={{ label: "Importar lista", onClick: () => {} }}
    />
  ),
}
