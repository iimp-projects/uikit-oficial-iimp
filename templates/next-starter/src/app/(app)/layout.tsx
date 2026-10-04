import type { ReactNode } from "react"
import { AppFrame } from "@/components/app-frame"

export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AppFrame>{children}</AppFrame>
}
