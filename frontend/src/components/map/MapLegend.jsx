const ENTRIES = [
  { label: "Critical", colorVar: "var(--color-destructive)" },
  { label: "High", colorVar: "var(--color-warning)" },
  { label: "Medium", colorVar: "var(--color-chart-1)" },
  { label: "Low / none", colorVar: "var(--color-success)" },
]

/**
 * Map overlay legend. Number inside each marker = detection count;
 * pulsing ring = critical road.
 */
export function MapLegend() {
  return (
    <div
      className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-xl border border-border/50 bg-card/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md"
      role="note"
      aria-label="Map legend"
    >
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Marker severity · number = detections
      </p>
      <ul className="space-y-1">
        {ENTRIES.map(({ label, colorVar }) => (
          <li key={label} className="flex items-center gap-2 text-xs text-foreground/80">
            <span
              aria-hidden="true"
              className="size-3 rounded-full border-2 border-background shadow-md"
              style={{ background: colorVar, boxShadow: `0 0 8px color-mix(in srgb, ${colorVar} 40%, transparent)` }}
            />
            {label}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span aria-hidden="true" className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-50" />
          <span className="relative inline-flex size-3 rounded-full bg-destructive" />
        </span>
        Pulsing ring = critical
      </p>
    </div>
  )
}
