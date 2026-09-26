import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group"
import { Button } from "./button"

const meta: Meta<typeof ButtonGroup> = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Día</Button>
      <Button variant="outline">Semana</Button>
      <Button variant="outline">Mes</Button>
    </ButtonGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Vista</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline">Lista</Button>
      <Button variant="outline">Calendario</Button>
    </ButtonGroup>
  ),
}
