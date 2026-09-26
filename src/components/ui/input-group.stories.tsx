import type { Meta, StoryObj } from "@storybook/react-vite"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group"

const meta: Meta<typeof InputGroup> = {
  title: "Primitives/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof InputGroup>

export const WithIcon: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Buscar participante..." />
    </InputGroup>
  ),
}

export const WithSuffixText: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>PEN</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}
