import type { Meta, StoryObj } from "@storybook/react-vite"
import { DataTable } from "./DataTable"
import { Badge } from "../ui/badge"

type Participante = {
  id: number
  nombre: string
  email: string
  estado: "confirmado" | "pendiente"
}

const data: Participante[] = [
  { id: 1, nombre: "María Rodríguez", email: "maria@correo.com", estado: "confirmado" },
  { id: 2, nombre: "Carlos Vega", email: "carlos@correo.com", estado: "pendiente" },
  { id: 3, nombre: "Ana Torres", email: "ana@correo.com", estado: "confirmado" },
]

const columns = [
  { key: "nombre", header: "Nombre" },
  { key: "email", header: "Email" },
  {
    key: "estado",
    header: "Estado",
    cell: (row: Participante) => (
      <Badge variant={row.estado === "confirmado" ? "success" : "outline"}>
        {row.estado === "confirmado" ? "Confirmado" : "Pendiente"}
      </Badge>
    ),
  },
]

const meta: Meta<typeof DataTable> = {
  title: "Patterns/DataTable",
  component: DataTable,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DataTable<Participante>>

export const Default: Story = {
  args: {
    columns,
    data,
    getRowId: (row: Participante) => row.id,
  },
}

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyState: "Aún no hay participantes inscritos.",
  },
}
