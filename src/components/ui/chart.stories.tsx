import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./chart"

const data = [
  { mes: "Ene", inscripciones: 42 },
  { mes: "Feb", inscripciones: 68 },
  { mes: "Mar", inscripciones: 51 },
  { mes: "Abr", inscripciones: 89 },
  { mes: "May", inscripciones: 76 },
]

const chartConfig = {
  inscripciones: {
    label: "Inscripciones",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

const meta: Meta<typeof ChartContainer> = {
  title: "Primitives/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ChartContainer>

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-64 w-full max-w-xl">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="inscripciones" fill="var(--color-inscripciones)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}
