import type { Meta, StoryObj } from "@storybook/react-vite"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="agenda" className="w-96">
      <TabsList>
        <TabsTrigger value="agenda">Agenda</TabsTrigger>
        <TabsTrigger value="ponentes">Ponentes</TabsTrigger>
        <TabsTrigger value="sedes">Sedes</TabsTrigger>
      </TabsList>
      <TabsContent value="agenda">Programa del evento por día.</TabsContent>
      <TabsContent value="ponentes">Listado de ponentes confirmados.</TabsContent>
      <TabsContent value="sedes">Ubicación y salas disponibles.</TabsContent>
    </Tabs>
  ),
}
