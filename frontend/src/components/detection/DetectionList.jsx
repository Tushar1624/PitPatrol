import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { resolveDetectionClass } from "@/utils/detection-classes"
import { cn } from "@/lib/utils"

/**
 * Accessible list of selectable detections.
 * Uses a semantic <ul> of <button>s — avoids complex listbox ARIA that
 * requires full keyboard interaction patterns. Hover/focus highlights the
 * matching box; click selects it.
 */
export function DetectionList({ detections, hoveredId, selectedId, onHover, onSelect }) {
  return (
    <ul
      aria-label="Detections"
      className="max-h-72 divide-y divide-border/30 overflow-y-auto rounded-xl border border-border/50 bg-card"
    >
      {detections.map((detection) => {
        const meta = resolveDetectionClass(detection.className)
        const isSelected = selectedId === detection.id
        const isHovered = hoveredId === detection.id

        return (
          <li key={detection.id} className="list-none">
            <button
              type="button"
              onClick={() => onSelect(isSelected ? null : detection.id)}
              onMouseEnter={() => onHover(detection.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(detection.id)}
              onBlur={() => onHover(null)}
              aria-pressed={isSelected}
              aria-label={`${meta.label ?? detection.className}, confidence ${Math.round(
                detection.confidence * 100
              )} percent, severity ${detection.severity}`}
              className={cn(
                "flex min-h-11 w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-all duration-100 outline-none",
                "focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:ring-inset",
                isSelected
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : isHovered
                    ? "bg-muted/30"
                    : "hover:bg-muted/20"
              )}
            >
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full shadow-[0_0_6px]"
                style={{
                  background: `var(${meta.colorVar})`,
                  boxShadow: `0 0 6px color-mix(in srgb, var(${meta.colorVar}) 50%, transparent)`,
                }}
              />
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {meta.label ?? detection.className}
              </span>
              <span className="tabular-nums text-xs font-medium text-muted-foreground">
                {Math.round(detection.confidence * 100)}%
              </span>
              <StatusBadge value={detection.severity} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
