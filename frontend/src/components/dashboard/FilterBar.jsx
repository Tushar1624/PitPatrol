import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Shared filter toolbar: built-in search input + any number of selects.
 *
 * filters: [{ id, label, value, onChange, options: [{value,label}] }]
 */
export function FilterBar({ searchValue, onSearchChange, searchPlaceholder = "Search…", filters = [], children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {onSearchChange && (
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="pl-9"
          />
        </div>
      )}

      {filters.map((filter) => (
        <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger
            className="w-full sm:w-44"
            aria-label={`Filter by ${filter.label.toLowerCase()}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {children}
    </div>
  )
}

export const ALL_VALUE = "all"

/** Helper for "All …" filter options. */
export function withAllOption(options, label = "All") {
  return [{ value: ALL_VALUE, label }, ...options]
}
