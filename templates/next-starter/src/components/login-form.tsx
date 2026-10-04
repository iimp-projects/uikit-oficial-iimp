"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LoginScreen } from "official-uikit-iimp"
import { APP } from "@/config/app"

/** Pantalla de inicio: cambia los textos aquí y conecta tu proveedor en `handleSignIn`. */
export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Placeholder: conecta aquí tu autenticación (NextAuth, Server Action, Google Workspace…).
  function handleSignIn() {
    setIsLoading(true)
    router.push("/dashboard")
  }

  return (
    <LoginScreen
      systemName={APP.name}
      systemTagline={APP.tagline}
      eyebrow="Producto IIMP"
      headline="Resumen breve de qué hace el sistema."
      description="Una o dos frases sobre el problema que resuelve."
      features={["Beneficio clave", "Otra capacidad relevante"]}
      footer={`© ${String(new Date().getFullYear())} Instituto de Ingenieros de Minas del Perú`}
      subtitle="Ingresa utilizando tu correo corporativo (@iimp.org.pe)."
      loading={isLoading}
      onSignIn={handleSignIn}
      legal={{
        privacyHref: "/politica-privacidad",
        termsHref: "/terminos-uso",
      }}
      LinkComponent={Link}
    />
  )
}
