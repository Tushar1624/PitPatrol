import { Skeleton } from "@/components/ui/skeleton"

/**
 * Generic loading block for future async views.
 * Renders an accessible skeleton with a title row and content rows.
 */
export function LoadingState({ label = "Loading…", rows = 3 }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-6"
    >
      <Skeleton className="h-5 w-1/3" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-4 w-full"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
