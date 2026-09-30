import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "official-uikit-iimp"
import { appVersion } from "@/lib/project"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">IIMP</Badge>
            <Badge variant="outline">{appVersion}</Badge>
          </div>
          <CardTitle>Proyecto listo para trabajar</CardTitle>
          <CardDescription>
            Next.js, TypeScript estricto, Tailwind y el UI Kit oficial están
            configurados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Reemplaza esta página por el primer flujo de tu producto.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
