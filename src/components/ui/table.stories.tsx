import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./table"
import { Badge } from "./badge"

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Table>

const participantes = [
  { nombre: "María Rodríguez", empresa: "Minera Antamina", estado: "Confirmado" },
  { nombre: "Jorge Salazar", empresa: "Southern Perú", estado: "Pendiente" },
  { nombre: "Lucía Fernández", empresa: "Minsur", estado: "Confirmado" },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Participantes registrados en el evento.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participantes.map((p) => (
          <TableRow key={p.nombre}>
            <TableCell>{p.nombre}</TableCell>
            <TableCell>{p.empresa}</TableCell>
            <TableCell>
              <Badge variant={p.estado === "Confirmado" ? "default" : "outline"}>
                {p.estado}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
