import type { Meta, StoryObj } from "@storybook/react-vite"
import { UsersIcon } from "@phosphor-icons/react"
import { StatCard } from "./StatCard"

const meta: Meta<typeof StatCard> = {
  title: "Patterns/StatCard",
  component: StatCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <StatCard
        label="Inscripciones"
        value="1,284"
        trend={{ value: "12% vs. semana pasada", direction: "up" }}
        icon={<UsersIcon className="size-6" />}
      />
      <StatCard
        label="Cancelaciones"
        value="18"
        trend={{ value: "4% vs. semana pasada", direction: "down" }}
      />
    </div>
  ),
}
