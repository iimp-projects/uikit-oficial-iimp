import type { Metadata } from "next"
import type { ReactNode } from "react"
import "official-uikit-iimp/style.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Proyecto IIMP",
  description: "Aplicación creada con el estándar oficial IIMP",
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
