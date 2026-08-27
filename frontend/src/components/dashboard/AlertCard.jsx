import { CircleAlertIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { formatDaysAgo } from "@/utils/format"

export function AlertCard({ alert, action }) {
  return (
    <Card className="gap-0 border-l-[3px] border-l-destructive border-destructive/15 bg-destructive/[0.03] py-4 transition-all duration-200 hover:bg-destructive/[0.06]">
      <CardContent className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive"
        >
          <CircleAlertIcon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{alert.road}</p>
            <StatusBadge value={alert.severity} />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {alert.message}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            Raised {formatDaysAgo(alert.raisedAt)}
          </p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </CardContent>
    </Card>
  )
}
