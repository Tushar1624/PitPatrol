import { cn } from "@/lib/utils"

/**
 * Lightweight progress bar with animated gradient fill.
 * Value is cosmetic in the mock detection flow.
 */
export function Progress({ value = 0, className, ...props }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted/50",
        className
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-neon-cyan transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
      {value > 0 && value < 100 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            animation: "shimmer 1.8s ease-in-out infinite",
          }}
        />
      )}
    </div>
  )
}
