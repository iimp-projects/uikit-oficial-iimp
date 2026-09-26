import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileTextIcon } from "@phosphor-icons/react"
import { DataCard } from "./DataCard"
import { DataTable } from "./DataTable"
import { StatusBadge } from "./StatusBadge"
import { SearchField } from "./SearchField"
import { Badge } from "../ui/badge"

const meta: Meta<typeof DataCard> = {
  title: "Patterns/DataCard",
  component: DataCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta

type Row = { op: string; file: string; amount: string; status: "success" | "warning" }
const rows: Row[] = [
  { op: "OP-9834120", file: "SUNAT_DETRAC_LOTE_20240525.pdf", amount: "S/ 489,230.50", status: "success" },
  { op: "OP-9833890", file: "SUNAT_DETRACCIONES_MAYO_SEM3.pdf", amount: "S/ 283,150.00", status: "warning" },
]

export const Default: StoryObj<typeof DataCard> = {
  render: () => (
    <DataCard
      title="Lotes de Detracciones"
      description="Historial de archivos procesados y auditoría"
      icon={<FileTextIcon />}
      meta={<Badge variant="secondary">4 de 4</Badge>}
      actions={<SearchField className="w-64" placeholder="Buscar por lote…" />}
    >
      <DataTable
        data={rows}
        getRowId={(r) => r.op}
        columns={[
          { key: "op", header: "Operación SUNAT" },
          { key: "file", header: "Archivo" },
          { key: "amount", header: "Monto" },
          {
            key: "status",
            header: "Estado",
            cell: (r) => (
              <StatusBadge status={r.status}>{r.status === "success" ? "Procesado" : "Con observaciones"}</StatusBadge>
            ),
          },
        ]}
      />
    </DataCard>
  ),
}
