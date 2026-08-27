import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/format"

/**
 * Popup contents for a road marker: status, detection count, severity,
 * issue types and the last inspection date.
 */
export function RoadPopup({ road }) {
  return (
    <div className="min-w-[220px] space-y-2.5">
      <header>
        <p className="text-sm font-semibold leading-tight text-foreground">{road.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {`${road.code} · ${road.lengthKm} km`}
        </p>
      </header>

      <dl className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Status</dt>
          <dd><StatusBadge value={road.status} /></dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Detections</dt>
          <dd className="font-semibold tabular-nums text-foreground">{road.issueCount}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Severity</dt>
          <dd><StatusBadge value={road.severity} /></dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Last inspection</dt>
          <dd className="font-medium text-foreground/80">{formatDate(road.lastInspection)}</dd>
        </div>
      </dl>

      <footer>
        <p className="mb-1 text-xs text-muted-foreground">Issue types</p>
        {road.issueTypes.length > 0 ? (
          <ul className="flex flex-wrap gap-1" aria-label="Issue types on this road">
            {road.issueTypes.map((type) => (
              <li key={type}>
                <Badge variant="secondary" className="text-[11px]">{type}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs font-medium text-success">No issues recorded</p>
        )}
      </footer>
    </div>
  )
}
