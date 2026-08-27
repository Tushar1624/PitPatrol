import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { Progress } from "@/components/ui/progress"
import { resolveDetectionClass } from "@/utils/detection-classes"

/**
 * Detail panel for the currently selected detection.
 */
export function DetectionDetails({ detection }) {
  if (!detection) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 p-6 text-center">
        <p className="text-sm font-medium text-foreground/80">No detection selected</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Click a bounding box or an item in the list to inspect it.
        </p>
      </div>
    )
  }

  const meta = resolveDetectionClass(detection.className)
  const confidencePct = Math.round(detection.confidence * 100)
  const { x, y, width, height } = detection.bbox

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{meta.label ?? detection.className}</h3>
        <StatusBadge value={detection.severity} />
      </div>

      <dl className="mt-3 space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Confidence</dt>
          <dd className="font-semibold tabular-nums text-foreground">{confidencePct}%</dd>
        </div>
        <Progress value={confidencePct} aria-label={`Model confidence ${confidencePct}%`} />

        <div className="flex items-center justify-between gap-3 pt-1">
          <dt className="text-muted-foreground">Detection ID</dt>
          <dd className="font-mono text-xs text-muted-foreground">{detection.id}</dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Raw class</dt>
          <dd className="font-mono text-xs text-muted-foreground">{detection.className}</dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Box position (normalized)</dt>
          <dd className="mt-1 grid grid-cols-4 gap-2 text-center font-mono text-xs">
            {[
              ["x", x],
              ["y", y],
              ["w", width],
              ["h", height],
            ].map(([key, value]) => (
              <span key={key} className="rounded-lg bg-muted/40 px-1 py-1.5 tabular-nums text-foreground/80">
                {`${key} ${(value * 100).toFixed(0)}%`}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  )
}
