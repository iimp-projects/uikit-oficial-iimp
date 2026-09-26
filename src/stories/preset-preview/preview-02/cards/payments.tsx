"use client"

import { RiArrowRightSLine, RiCalendarLine, RiDashboardLine, RiMoreLine, RiRefreshLine, RiRepeatLine } from "@remixicon/react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../../../../components/ui/item"

export function Payments() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <RiMoreLine />
                    <span className="sr-only">Account options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Statements</DropdownMenuItem>
                    <DropdownMenuItem>Documents</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Payments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <RiDashboardLine />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Change transfer limit</ItemTitle>
                <ItemDescription>
                  Adjust how much you can send from your balance.
                </ItemDescription>
              </ItemContent>
              <RiArrowRightSLine className="size-4 shrink-0 text-muted-foreground" />
            </a>
          </Item>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <RiCalendarLine />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Scheduled transfers</ItemTitle>
                <ItemDescription>
                  Set up a transfer to send at a later date.
                </ItemDescription>
              </ItemContent>
              <RiArrowRightSLine className="size-4 shrink-0 text-muted-foreground" />
            </a>
          </Item>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <RiRepeatLine />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Direct Debits</ItemTitle>
                <ItemDescription>
                  Set up and manage regular payments.
                </ItemDescription>
              </ItemContent>
              <RiArrowRightSLine className="size-4 shrink-0 text-muted-foreground" />
            </a>
          </Item>
          <Item asChild variant="muted">
            <a href="#">
              <ItemMedia variant="icon">
                <RiRefreshLine />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Recurring card payments</ItemTitle>
                <ItemDescription>
                  Manage your repeated card transactions.
                </ItemDescription>
              </ItemContent>
              <RiArrowRightSLine className="size-4 shrink-0 text-muted-foreground" />
            </a>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
