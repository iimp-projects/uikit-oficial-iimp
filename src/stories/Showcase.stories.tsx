import type { Meta, StoryObj } from "@storybook/react-vite"
import { MagnifyingGlassIcon, PlusIcon, DownloadSimpleIcon, EyeIcon } from "@phosphor-icons/react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { FormField } from "../components/patterns/FormField"
import { StatusBadge } from "../components/patterns/StatusBadge"
import { DataTable } from "../components/patterns/DataTable"
import { PageHeader } from "../components/patterns/PageHeader"

const meta: Meta = {
  title: "Foundations/Showcase",
  parameters: { layout: "fullscreen" },
}
export default meta

type Row = { ruc: string; nombre: string; estado: "success" | "warning" | "destructive"; monto: string }
const rows: Row[] = [
  { ruc: "20100055231", nombre: "COMPAÑIA MINERA ANTAMINA S.A.", estado: "success", monto: "S/ 14,520.50" },
  { ruc: "20501234567", nombre: "SOCIEDAD MINERA CERRO VERDE S.A.A.", estado: "warning", monto: "S/ 89,400.00" },
  { ruc: "20334455667", nombre: "SOUTHERN PERU COPPER CORPORATION", estado: "destructive", monto: "S/ 32,400.00" },
]

export const Pagina: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <PageHeader
          title="Directorio de Constancias"
          description="Búsqueda, descarga y visor de constancias PDF de detracciones."
          actions={
            <Button>
              <PlusIcon /> Cargar PDF
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Constancias de Detracción</CardTitle>
            <CardDescription>Detracciones registradas y validadas con estado de despacho.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-64 flex-1">
                <MagnifyingGlassIcon className="absolute top-1/2 left-4 size-6 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-12" placeholder="Buscar por RUC, constancia o proveedor" />
              </div>
              <Select defaultValue="todos">
                <SelectTrigger className="w-48" aria-label="Estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <DownloadSimpleIcon /> Exportar
              </Button>
            </div>

            <Tabs defaultValue="todos">
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="sin">Sin correo</TabsTrigger>
                <TabsTrigger value="con">Con correo</TabsTrigger>
              </TabsList>
              <TabsContent value="todos" />
            </Tabs>

            <DataTable
              data={rows}
              getRowId={(r) => r.ruc}
              columns={[
                { key: "ruc", header: "RUC" },
                { key: "nombre", header: "Proveedor" },
                { key: "monto", header: "Monto" },
                {
                  key: "estado",
                  header: "Estado",
                  cell: (r) => (
                    <StatusBadge status={r.estado}>
                      {r.estado === "success" ? "Enviado" : r.estado === "warning" ? "Pendiente" : "Sin correo"}
                    </StatusBadge>
                  ),
                },
                {
                  key: "acciones",
                  header: "Acciones",
                  cell: () => (
                    <Button variant="ghost" size="icon-sm" aria-label="Ver">
                      <EyeIcon />
                    </Button>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Formulario</CardTitle>
              <CardDescription>Inputs de 50px, fuente de 16px, fondo sólido.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <FormField label="Razón social" required>
                <Input placeholder="Escribe aquí" />
              </FormField>
              <FormField label="Correo" error="Correo inválido">
                <Input defaultValue="correo@" aria-invalid />
              </FormField>
              <FormField label="Comentarios">
                <Textarea placeholder="Notas internas" />
              </FormField>
              <div className="flex items-center gap-3">
                <Checkbox id="a" defaultChecked />
                <Label htmlFor="a">Enviar copia</Label>
                <Switch id="b" defaultChecked className="ml-auto" aria-label="Activo" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>Guardar</Button>
                <Button variant="secondary">Cancelar</Button>
                <Button variant="outline">Volver</Button>
                <Button variant="ghost">Omitir</Button>
                <Button variant="destructive">Eliminar</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Pequeño</Button>
                <Button size="lg">Grande</Button>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabs y separadores</CardTitle>
              <CardDescription>Línea fina y armónica.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Tabs defaultValue="a">
                <TabsList variant="line">
                  <TabsTrigger value="a">Resumen</TabsTrigger>
                  <TabsTrigger value="b">Historial</TabsTrigger>
                  <TabsTrigger value="c">Ajustes</TabsTrigger>
                </TabsList>
                <TabsContent value="a" className="pt-4 text-muted-foreground">
                  Contenido de la pestaña.
                </TabsContent>
              </Tabs>
              <Separator />
              <p className="text-muted-foreground">Texto de cuerpo a 16px, color slate, alto de línea 24px.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
}
