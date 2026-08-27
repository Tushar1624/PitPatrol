import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function pageWindow(current, count, span = 1) {
  const pages = new Set(
    [1, count, current - span, current, current + span].filter(
      (page) => page >= 1 && page <= count
    )
  )
  return [...pages].sort((a, b) => a - b)
}

/**
 * Controlled pagination UI. Parent owns the page state.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  labels = { previous: "Previous page", next: "Next page", page: "Page" },
}) {
  if (pageCount <= 1) return null

  const items = pageWindow(page, pageCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-end gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label={labels.previous}
      >
        <ChevronLeftIcon />
      </Button>

      {items.map((item, index) => (
        <span key={item} className="flex items-center">
          {index > 0 && item - items[index - 1] > 1 && (
            <span aria-hidden="true" className="px-1 text-xs text-muted-foreground">
              …
            </span>
          )}
          <Button
            variant={item === page ? "default" : "outline"}
            size="icon-sm"
            aria-current={item === page ? "page" : undefined}
            aria-label={`${labels.page} ${item}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        </span>
      ))}

      <Button
        variant="outline"
        size="icon-sm"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label={labels.next}
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  )
}
