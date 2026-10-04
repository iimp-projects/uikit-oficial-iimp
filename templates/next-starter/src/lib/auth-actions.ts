"use server"

import { redirect } from "next/navigation"

// Placeholder hasta existir sesión real: aquí se invalidará la sesión.
export async function signOut(): Promise<never> {
  await Promise.resolve()
  redirect("/")
}
