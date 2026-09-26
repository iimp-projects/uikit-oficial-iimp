import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card"
import { Button } from "./button"

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>PERUMIN 2026</CardTitle>
        <CardDescription>17 al 21 de setiembre, Arequipa</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Convención minera con más de 300 expositores y 40,000 visitantes esperados.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Ver detalle</Button>
      </CardFooter>
    </Card>
  ),
}
