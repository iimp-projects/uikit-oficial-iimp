"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { AppShell, LanguageSwitcher } from "official-uikit-iimp"
import { APP } from "@/config/app"
import { NAVIGATION } from "@/config/navigation"
import { signOut } from "@/lib/auth-actions"

// Placeholder hasta existir sesión real: reemplaza por el usuario de tu proveedor de autenticación.
const USER = { name: "Usuario", email: "usuario@iimp.org.pe" }

function currentTitle(pathname: string) {
  return (
    NAVIGATION.flatMap((group) => group.items).find((item) =>
      pathname.startsWith(item.href),
    )?.title ?? "Inicio"
  )
}

/** Armazón autenticado: solo pasas el menú (src/config/navigation.tsx) y el contenido. */
export function AppFrame({ children }: Readonly<{ children?: ReactNode }>) {
  const pathname = usePathname()

  return (
    <AppShell
      brand={{ title: APP.name, subtitle: APP.version }}
      navigation={NAVIGATION}
      currentPath={pathname}
      user={USER}
      signOutAction={signOut}
      breadcrumbs={[
        { label: APP.name, href: "/dashboard" },
        { label: currentTitle(pathname) },
      ]}
      languageSwitcher={
        <LanguageSwitcher
          languages={["es", "en"]}
          defaultValue="es"
          googleTranslate={{ sourceLanguage: "es" }}
        />
      }
      LinkComponent={Link}
    >
      {children}
    </AppShell>
  )
}
