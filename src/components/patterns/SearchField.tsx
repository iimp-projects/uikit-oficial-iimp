import * as React from "react"
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

type SearchFieldProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  onSearch?: (value: string) => void
  debounceMs?: number
  className?: string
}

function SearchField({
  value,
  defaultValue,
  placeholder = "Buscar…",
  onSearch,
  debounceMs = 300,
  className,
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = React.useState(value ?? defaultValue ?? "")

  React.useEffect(() => {
    if (value !== undefined) setInternalValue(value)
  }, [value])

  React.useEffect(() => {
    if (!onSearch) return
    const timer = setTimeout(() => onSearch(internalValue), debounceMs)
    return () => clearTimeout(timer)
  }, [internalValue, debounceMs, onSearch])

  return (
    <div className={cn("relative w-full", className)}>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={internalValue}
        placeholder={placeholder}
        onChange={(event) => setInternalValue(event.target.value)}
        className="pl-9 pr-9"
        aria-label={placeholder}
      />
      {internalValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          onClick={() => setInternalValue("")}
        >
          <XIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Limpiar búsqueda</span>
        </Button>
      ) : null}
    </div>
  )
}

export { SearchField }
export type { SearchFieldProps }
