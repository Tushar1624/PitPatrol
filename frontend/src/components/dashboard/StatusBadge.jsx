import { Badge } from "@/components/ui/badge"
import { metaFor } from "@/utils/domain-meta"
import { cn } from "@/lib/utils"

const DOT_COLORS = {
  success: "bg-success shadow-success/50",
  warning: "bg-warning shadow-warning/50",
  destructive: "bg-destructive shadow-destructive/50",
  secondary: "bg-muted-foreground shadow-muted-foreground/30",
  outline: "bg-border shadow-border/30",
}

/**
 * Consistent badge for any domain status/severity value.
 * Includes a color dot so state is readable beyond color alone.
 */
export function StatusBadge({ value, className }) {
  const { label, badgeVariant } = metaFor(value)
  return (
    <Badge variant={badgeVariant} className={cn("gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full shadow-[0_0_4px]", DOT_COLORS[badgeVariant])}
      />
      {label}
    </Badge>
  )
}
