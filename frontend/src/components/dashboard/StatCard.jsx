import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/utils/format"

export function StatCard({ label, value, delta, icon: Icon, tone = "primary" }) {
  const tones = {
    primary: "bg-primary/15 text-primary shadow-primary/10",
    warning: "bg-warning/15 text-warning shadow-warning/10",
    destructive: "bg-destructive/15 text-destructive shadow-destructive/10",
    success: "bg-success/15 text-success shadow-success/10",
  }

  return (
    <Card className="gap-0 py-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
      <CardContent className="flex items-start justify-between gap-3 px-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1.5 truncate text-3xl font-bold tracking-tight text-foreground">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {delta && (
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                delta.positive ? "text-success" : "text-destructive"
              )}
            >
              {delta.direction === "up" ? (
                <TrendingUpIcon aria-hidden="true" className="size-3.5" />
              ) : (
                <TrendingDownIcon aria-hidden="true" className="size-3.5" />
              )}
              {delta.value}
              <span className="sr-only">
                {delta.positive ? " (improvement)" : " (regression)"}
              </span>
            </p>
          )}
        </div>
        {Icon && (
          <span
            aria-hidden="true"
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-lg",
              tones[tone]
            )}
          >
            <Icon className="size-5" />
          </span>
        )}
      </CardContent>
    </Card>
  )
}
