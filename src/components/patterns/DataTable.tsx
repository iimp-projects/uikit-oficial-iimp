import * as React from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table"
import { Skeleton } from "../ui/skeleton"
import { cn } from "../../lib/utils"

type DataTableColumn<TData> = {
  key: string
  header: React.ReactNode
  cell?: (row: TData) => React.ReactNode
  className?: string
}

type DataTableProps<TData> = {
  columns: DataTableColumn<TData>[]
  data: TData[]
  loading?: boolean
  loadingRowCount?: number
  emptyState?: React.ReactNode
  getRowId?: (row: TData, index: number) => string | number
  onRowClick?: (row: TData) => void
  className?: string
}

function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  loadingRowCount = 5,
  emptyState,
  getRowId,
  onRowClick,
  className,
}: DataTableProps<TData>) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={column.className}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Skeleton className="h-4 w-full max-w-32" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
              {emptyState ?? "No hay datos para mostrar."}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow
              key={getRowId ? getRowId(row, index) : index}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell ? column.cell(row) : String(row[column.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export { DataTable }
export type { DataTableProps, DataTableColumn }
