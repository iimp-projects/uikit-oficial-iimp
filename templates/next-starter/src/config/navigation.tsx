import { SquaresFourIcon } from "@phosphor-icons/react"
import type { AppShellNavGroup } from "official-uikit-iimp"

/**
 * El menú de tu aplicación. Cada grupo es una sección del sidebar (sin `label` = sin encabezado).
 * `disabled: true` muestra la vista como pendiente. La visibilidad por rol se aplica en servidor.
 */
export const NAVIGATION: readonly AppShellNavGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: <SquaresFourIcon /> },
    ],
  },
]
