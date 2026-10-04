import * as React from "react"
import { cn } from "../../lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"
import {
  DashboardHeader,
  DashboardLayout,
  DashboardNotifications,
  DashboardSidebarBrand,
  DashboardSidebarUser,
  type DashboardSidebarTone,
} from "./DashboardLayout"

type AppShellNavItem = {
  title: string
  href: string
  /** Icon element, for example `<SquaresFour />` from @phosphor-icons/react. */
  icon?: React.ReactNode
  /** Number shown at the end of the item. Hidden when 0 or undefined. */
  badge?: number
  /** View not built yet: rendered disabled and not clickable. */
  disabled?: boolean
}

type AppShellNavGroup = {
  /** Group heading. Omit it for a heading-less group such as the Dashboard link. */
  label?: string
  items: readonly AppShellNavItem[]
}

type AppShellBreadcrumb = {
  label: string
  href?: string
}

type AppShellProps = {
  brand: {
    title: string
    /** Line under the title, usually the app version. */
    subtitle?: string
    logoSrc?: string
    logoAlt?: string
  }
  /** The menu. This is the main thing an app provides. */
  navigation: readonly AppShellNavGroup[]
  /** Current pathname, used to mark the active item (longest matching href wins). */
  currentPath: string
  user: { name: string; email: string; avatarSrc?: string }
  /** Sign-out form action (Server Action). Shows the sign-out button. */
  signOutAction?: React.ComponentProps<"form">["action"]
  /** Sign-out click handler for client-side providers. */
  onSignOut?: React.MouseEventHandler<HTMLButtonElement>
  breadcrumbs?: readonly AppShellBreadcrumb[]
  /** Items of the notifications popover. Empty shows the default empty message. */
  notifications?: { count?: number; children?: React.ReactNode }
  /** Usually a `LanguageSwitcher`. Shown before the bell. */
  languageSwitcher?: React.ReactNode
  /** Page-level actions aligned to the header end. */
  actions?: React.ReactNode
  /** Link component, for example `next/link`. Defaults to a plain anchor. */
  LinkComponent?: React.ElementType
  sidebarTone?: DashboardSidebarTone
  /** Layout-only classes for the content container. */
  contentClassName?: string
  /** Page content. Leave it empty at first: the shell works without content. */
  children?: React.ReactNode
}

function matches(currentPath: string, href: string) {
  return href === "/"
    ? currentPath === "/"
    : currentPath === href || currentPath.startsWith(`${href}/`)
}

/** Longest matching href across the whole menu, so nested routes never mark two items. */
function findActiveHref(
  currentPath: string,
  groups: readonly AppShellNavGroup[],
) {
  return groups
    .flatMap((group) => group.items)
    .filter((item) => !item.disabled && matches(currentPath, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href
}

function AppShellNav({
  navigation,
  currentPath,
  LinkComponent,
}: Pick<AppShellProps, "navigation" | "currentPath"> & {
  LinkComponent: React.ElementType
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const activeHref = findActiveHref(currentPath, navigation)

  return (
    <SidebarContent className="px-3 py-4">
      {navigation.map((group, index) => (
        <SidebarGroup key={group.label ?? `group-${String(index)}`}>
          {group.label ? (
            <SidebarGroupLabel className="text-[11px]! font-semibold! tracking-wider! text-sidebar-foreground/55! uppercase!">
              {group.label}
            </SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = item.href === activeHref
                return (
                  <SidebarMenuItem key={item.href}>
                    {item.disabled ? (
                      <SidebarMenuButton disabled aria-disabled>
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild isActive={active}>
                        <LinkComponent
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => {
                            if (isMobile) setOpenMobile(false)
                          }}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </LinkComponent>
                      </SidebarMenuButton>
                    )}
                    {item.badge ? (
                      <SidebarMenuBadge className="top-1/2! -translate-y-1/2! bg-warning text-warning-foreground">
                        {item.badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}

/**
 * Complete authenticated shell: brand, menu, user + sign-out, breadcrumb header, language switcher
 * and notifications. The app only supplies the menu, the user and the page content (children).
 */
function AppShell({
  brand,
  navigation,
  currentPath,
  user,
  signOutAction,
  onSignOut,
  breadcrumbs,
  notifications,
  languageSwitcher,
  actions,
  LinkComponent = "a",
  sidebarTone = "primary",
  contentClassName,
  children,
}: AppShellProps) {
  const crumbs = breadcrumbs?.length ? (
    <Breadcrumb className="hidden min-w-0 sm:flex">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const last = index === breadcrumbs.length - 1
          return (
            <React.Fragment key={`${crumb.label}-${String(index)}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {last || !crumb.href ? (
                  <BreadcrumbPage className="font-semibold">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <LinkComponent href={crumb.href}>
                      {crumb.label}
                    </LinkComponent>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  ) : null

  return (
    <DashboardLayout
      sidebarTone={sidebarTone}
      contentClassName={cn("space-y-6", contentClassName)}
      sidebar={
        <Sidebar collapsible="offcanvas">
          <DashboardSidebarBrand
            title={brand.title}
            {...(brand.subtitle ? { description: brand.subtitle } : {})}
            {...(brand.logoSrc ? { logoSrc: brand.logoSrc } : {})}
            {...(brand.logoAlt ? { logoAlt: brand.logoAlt } : {})}
          />
          <AppShellNav
            navigation={navigation}
            currentPath={currentPath}
            LinkComponent={LinkComponent}
          />
          <DashboardSidebarUser
            name={user.name}
            email={user.email}
            {...(user.avatarSrc ? { avatarSrc: user.avatarSrc } : {})}
            {...(signOutAction ? { signOutAction } : {})}
            {...(onSignOut ? { onSignOut } : {})}
          />
        </Sidebar>
      }
      header={
        <DashboardHeader
          navigation={crumbs}
          languageSwitcher={languageSwitcher}
          notifications={
            <DashboardNotifications count={notifications?.count ?? 0}>
              {notifications?.children}
            </DashboardNotifications>
          }
          actions={actions}
        />
      }
    >
      {children}
    </DashboardLayout>
  )
}

export { AppShell }
export type {
  AppShellBreadcrumb,
  AppShellNavGroup,
  AppShellNavItem,
  AppShellProps,
}
