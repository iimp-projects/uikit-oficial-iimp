"use client"

import { RiAddLine, RiSearchLine } from "@remixicon/react"

import { Button } from "../../../../components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../../../components/ui/input-group"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../../components/ui/toggle-group"

export function CatalogToolbar() {
  return (
    <div className="flex items-center gap-3">
      <InputGroup className="flex-1">
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search releases or catalog..." />
      </InputGroup>
      <Button>
        <RiAddLine />
        Upload New Release
      </Button>
      <ToggleGroup type="single" defaultValue="releases" variant="outline">
        <ToggleGroupItem value="all-tracks">All Tracks</ToggleGroupItem>
        <ToggleGroupItem value="releases">Releases</ToggleGroupItem>
        <ToggleGroupItem value="top-earners">Top Earners</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
