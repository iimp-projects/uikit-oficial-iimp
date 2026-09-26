import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { Marker, MarkerIcon, MarkerContent } from "./marker"

const meta: Meta<typeof Marker> = {
  title: "Primitives/Marker",
  component: Marker,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Marker>

export const Default: Story = {
  render: () => (
    <Marker>
      <MarkerIcon>
        <CheckCircleIcon />
      </MarkerIcon>
      <MarkerContent>Pago confirmado</MarkerContent>
    </Marker>
  ),
}

export const Separator: Story = {
  render: () => (
    <Marker variant="separator">
      <MarkerContent>15 de marzo</MarkerContent>
    </Marker>
  ),
}
