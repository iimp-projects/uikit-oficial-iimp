import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Switch } from "./switch"
import { Label } from "./label"

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true)
    return (
      <div className="flex items-center gap-2">
        <Switch id="story-notify" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="story-notify">Notificarme por correo</Label>
      </div>
    )
  },
}

export const Small: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return (
      <div className="flex items-center gap-2">
        <Switch
          id="story-notify-sm"
          size="sm"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="story-notify-sm">Modo compacto</Label>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "Notificaciones" },
}
