import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageHeader } from "./PageHeader"
import { Button } from "../ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

const meta: Meta<typeof PageHeader> = {
  title: "Patterns/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: "Participantes",
    description: "Gestiona los participantes inscritos al evento.",
    actions: <Button>Nuevo participante</Button>,
  },
}

export const ConBreadcrumb: Story = {
  render: () => (
    <PageHeader
      title="Ponentes"
      description="Ponentes confirmados para la edición 2026."
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Eventos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ponentes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      actions={
        <>
          <Button variant="outline">Exportar</Button>
          <Button>Agregar ponente</Button>
        </>
      }
    />
  ),
}
