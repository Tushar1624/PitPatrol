import { resolveDetectionClass, DETECTION_CLASSES } from "@/utils/detection-classes"

const SEVERITY_SWATCHES = [
  { key: "critical", label: "Critical", colorVar: "--color-destructive" },
  { key: "high", label: "High", colorVar: "--color-warning" },
  { key: "medium", label: "Medium", colorVar: "--color-chart-1" },
  { key: "low", label: "Low", colorVar: "--color-success" },
]

/**
 * Two legends in one: what each class colour means, and how box styling
 * maps to severity — so colour is never the only channel (a11y).
 */
export function DetectionLegend({ detections }) {
  const presentClasses = new Set(detections.map((d) => d.className))
  const resolved = [...presentClasses]
    .map((raw) => resolveDetectionClass(raw))
    .filter((meta) => meta.key !== "other")

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 sm:flex-row sm:flex-wrap sm:gap-6">
      <div role="group" aria-label="Defect classes">
        <p className="text-muted-note mb-1.5 font-semibold uppercase tracking-wider">Classes</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {resolved.map((meta) => (
            <li key={meta.key} className="flex items-center gap-1.5 text-xs text-foreground/80">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full shadow-[0_0_4px]"
                style={{
                  background: `var(${meta.colorVar})`,
                  boxShadow: `0 0 4px color-mix(in srgb, var(${meta.colorVar}) 40%, transparent)`,
                }}
              />
              {meta.label}
            </li>
          ))}
          <li className="flex items-center gap-1.5 text-xs text-foreground/60">
            <span aria-hidden="true" className="size-2.5 rounded-full border-2 border-dashed border-foreground/30" />
            Dashed outline = selected
          </li>
        </ul>
      </div>

      <div role="group" aria-label="Severity colours">
        <p className="text-muted-note mb-1.5 font-semibold uppercase tracking-wider">Severity</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {SEVERITY_SWATCHES.map(({ key, label, colorVar }) => (
            <li key={key} className="flex items-center gap-1.5 text-xs text-foreground/80">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full shadow-[0_0_4px]"
                style={{
                  background: `var(${colorVar})`,
                  boxShadow: `0 0 4px color-mix(in srgb, var(${colorVar}) 40%, transparent)`,
                }}
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">
        {`Classes available in the registry: ${Object.values(DETECTION_CLASSES).map((c) => c.label).join(", ")}.`}
      </span>
    </div>
  )
}
