import * as React from "react"
import { Bell, SignOut } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import logoIimp from "./assets/logo-iimp.png"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"
import {
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar"

type DashboardSidebarTone = "primary" | "secondary" | "base"

type SidebarToneStyle = React.CSSProperties & {
  "--sidebar"?: string
  "--sidebar-foreground"?: string
  "--sidebar-accent"?: string
  "--sidebar-accent-foreground"?: string
  "--sidebar-border"?: string
  "--sidebar-ring"?: string
  "--sidebar-primary"?: string
  "--sidebar-primary-foreground"?: string
}

const dashboardSidebarToneStyles: Record<DashboardSidebarTone, SidebarToneStyle> = {
  primary: {
    "--sidebar": "var(--primary)",
    "--sidebar-foreground": "var(--primary-foreground)",
    "--sidebar-accent": "color-mix(in oklch, var(--primary-foreground) 14%, transparent)",
    "--sidebar-accent-foreground": "var(--primary-foreground)",
    "--sidebar-border": "color-mix(in oklch, var(--primary-foreground) 18%, transparent)",
    "--sidebar-ring": "var(--primary-foreground)",
    "--sidebar-primary": "var(--primary-foreground)",
    "--sidebar-primary-foreground": "var(--primary)",
  },
  secondary: {
    "--sidebar": "var(--secondary)",
    "--sidebar-foreground": "var(--secondary-foreground)",
    "--sidebar-accent": "color-mix(in oklch, var(--secondary-foreground) 14%, transparent)",
    "--sidebar-accent-foreground": "var(--secondary-foreground)",
    "--sidebar-border": "color-mix(in oklch, var(--secondary-foreground) 18%, transparent)",
    "--sidebar-ring": "var(--secondary-foreground)",
    "--sidebar-primary": "var(--secondary-foreground)",
    "--sidebar-primary-foreground": "var(--secondary)",
  },
  base: {},
}

type DashboardLayoutProps = {
  /** App-owned navigation composed with the official Sidebar primitives. */
  sidebar: React.ReactNode
  /** Header slot. Prefer DashboardHeader for the standard responsive trigger. */
  header: React.ReactNode
  /** Route/page content rendered inside the main landmark. */
  children: React.ReactNode
  /** Sidebar token family. Defaults to the runtime primary pair. */
  sidebarTone?: DashboardSidebarTone
  /** Layout-only classes for the main content container. */
  contentClassName?: string
  /** Layout-only classes for SidebarInset. */
  insetClassName?: string
  className?: string
  style?: React.CSSProperties
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type DashboardHeaderProps = Omit<React.ComponentProps<"header">, "children"> & {
  /** Breadcrumb, page title, or other navigation context. */
  navigation?: React.ReactNode
  /** Runtime status shown before notifications and actions. */
  status?: React.ReactNode
  /** Locale control shown immediately before notifications. Prefer LanguageSwitcher. */
  languageSwitcher?: React.ReactNode
  /** Notification control. Prefer DashboardNotifications. */
  notifications?: React.ReactNode
  /** Page-level actions aligned to the end. */
  actions?: React.ReactNode
  /** Accessible name for the responsive sidebar trigger. */
  sidebarToggleLabel?: string
}

type DashboardSidebarBrandProps = Omit<React.ComponentProps<typeof SidebarHeader>, "children"> & {
  /** Official brand image. Defaults to the IIMP logo bundled with the UI Kit. */
  logoSrc?: string
  /** Accessible text for logoSrc. Defaults to the title text when it is a string. */
  logoAlt?: string
  /** Extra classes for the logo <img> (for example to cap its height inside the brand tile). */
  logoClassName?: string
  /** @deprecated Use the default logo or logoSrc. Kept only for backwards compatibility. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}

type DashboardSidebarUserProps = Omit<React.ComponentProps<typeof SidebarFooter>, "children"> & {
  name: string
  email: string
  avatarSrc?: string
  avatarAlt?: string
  avatarFallback?: React.ReactNode
  signOutLabel?: string
  signOutAction?: React.ComponentProps<"form">["action"]
  onSignOut?: React.MouseEventHandler<HTMLButtonElement>
}

type DashboardNotificationsProps = {
  /** Number announced by the trigger. A visual indicator appears when greater than zero. */
  count?: number
  title?: React.ReactNode
  emptyMessage?: React.ReactNode
  /** App-owned notification list. When omitted, emptyMessage is shown. */
  children?: React.ReactNode
  className?: string
}

type DashboardVersionProps = Omit<React.ComponentProps<typeof Badge>, "children"> & {
  /** Application version, for example `0.0.1` or `v0.0.1`. */
  version: string
}

/**
 * Authenticated application shell. Owns SidebarProvider, main landmark, responsive content
 * gutters, and semantic sidebar colors. The app supplies navigation, header content, routing,
 * permissions, session state, and page content.
 */
function DashboardLayout({
  sidebar,
  header,
  children,
  sidebarTone = "primary",
  contentClassName,
  insetClassName,
  className,
  style,
  defaultOpen,
  open,
  onOpenChange,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider
      data-sidebar-tone={sidebarTone}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={className}
      style={{ ...dashboardSidebarToneStyles[sidebarTone], ...style }}
    >
      {sidebar}
      <SidebarInset className={cn("min-w-0 bg-muted", insetClassName)}>
        {header}
        <div
          data-slot="dashboard-content"
          className={cn("mx-auto w-full max-w-screen-2xl flex-1 p-4 sm:p-6 lg:p-8", contentClassName)}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

/** Standard dashboard header with the official responsive SidebarTrigger. */
function DashboardHeader({
  navigation,
  status,
  languageSwitcher,
  notifications,
  actions,
  sidebarToggleLabel = "Mostrar u ocultar menú",
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <header
      data-slot="dashboard-header"
      className={cn(
        "sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border/70 bg-background/95 px-4 backdrop-blur sm:h-20 sm:px-6",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger aria-label={sidebarToggleLabel} />
        {navigation ? (
          <>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="min-w-0 flex-1">{navigation}</div>
          </>
        ) : null}
      </div>
      {status || languageSwitcher || notifications || actions ? (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {status}
          {languageSwitcher}
          {notifications}
          {actions}
        </div>
      ) : null}
    </header>
  )
}

/** Sidebar brand block whose bottom border aligns with DashboardHeader on desktop. */
function DashboardSidebarBrand({
  logoSrc = logoIimp,
  logoAlt,
  logoClassName,
  icon,
  title,
  description,
  className,
  ...props
}: DashboardSidebarBrandProps) {
  return (
    <SidebarHeader
      data-slot="dashboard-sidebar-brand"
      className={cn(
        "h-20 shrink-0 justify-center border-b border-sidebar-border px-4 py-3 group-data-[collapsible=icon]:px-1",
        className
      )}
      {...props}
    >
      <div className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sidebar-border bg-background group-data-[collapsible=icon]:size-10">
          {icon ?? (
            <img
              src={logoSrc}
              alt={logoAlt ?? (typeof title === "string" ? title : "Logo institucional")}
              className={cn("size-full object-contain", logoClassName)}
            />
          )}
        </div>
        <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
          <span className="truncate font-semibold text-sidebar-foreground">{title}</span>
          {description ? (
            <span className="truncate text-xs text-sidebar-foreground/70">{description}</span>
          ) : null}
        </div>
      </div>
    </SidebarHeader>
  )
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/** Sidebar user block. The app supplies its real sign-out handler or form action. */
function DashboardSidebarUser({
  name,
  email,
  avatarSrc,
  avatarAlt,
  avatarFallback,
  signOutLabel = "Cerrar sesión",
  signOutAction,
  onSignOut,
  className,
  ...props
}: DashboardSidebarUserProps) {
  const signOutButton =
    signOutAction || onSignOut ? (
      <Button
        type={signOutAction ? "submit" : "button"}
        variant="ghost"
        size="icon"
        aria-label={signOutLabel}
        onClick={onSignOut}
        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <SignOut aria-hidden="true" />
      </Button>
    ) : null

  return (
    <SidebarFooter
      data-slot="dashboard-sidebar-user"
      className={cn(
        "border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-1",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent p-2.5 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
        <Avatar size="lg">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={avatarAlt ?? name} /> : null}
          <AvatarFallback className="font-semibold">{avatarFallback ?? getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate text-sm font-semibold text-sidebar-foreground">{name}</span>
          <span className="truncate text-xs text-sidebar-foreground/70">{email}</span>
        </div>
        {signOutButton ? (
          <div className="group-data-[collapsible=icon]:hidden">
            {signOutAction ? <form action={signOutAction}>{signOutButton}</form> : signOutButton}
          </div>
        ) : null}
      </div>
    </SidebarFooter>
  )
}

/** Accessible notification bell and dropdown. Notification rows remain app-owned. */
function DashboardNotifications({
  count = 0,
  title = "Notificaciones",
  emptyMessage = "Todo al día. No hay alertas pendientes.",
  children,
  className,
}: DashboardNotificationsProps) {
  const label = count > 0 ? `Notificaciones (${count})` : "Notificaciones"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label={label} className="relative">
          <Bell aria-hidden="true" />
          {count > 0 ? (
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 size-2 rounded-full bg-warning ring-2 ring-card"
            />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className={cn("w-80 gap-0 p-0", className)}>
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">{title}</div>
        {children ?? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </PopoverContent>
    </Popover>
  )
}

/** Compact app version indicator for the DashboardHeader status slot. */
function DashboardVersion({ version, className, ...props }: DashboardVersionProps) {
  const label = version.startsWith("v") ? version : `v${version}`

  return (
    <Badge variant="outline" className={cn("font-mono tabular-nums", className)} {...props}>
      {label}
    </Badge>
  )
}

export {
  DashboardHeader,
  DashboardLayout,
  DashboardNotifications,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  DashboardVersion,
}
export type {
  DashboardHeaderProps,
  DashboardLayoutProps,
  DashboardNotificationsProps,
  DashboardSidebarBrandProps,
  DashboardSidebarTone,
  DashboardSidebarUserProps,
  DashboardVersionProps,
}
