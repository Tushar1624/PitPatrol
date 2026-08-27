import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function healthTone(score) {
  if (score < 50) return "bg-destructive"
  if (score < 75) return "bg-warning"
  return "bg-success"
}

export function RoadHealthOverview({ overall, segments }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Road health overview</CardTitle>
        <CardDescription>Composite score across monitored segments</CardDescription>
      </CardHeader>
      <CardContent className="flex h-[248px] flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-foreground">{overall}%</span>
          <span className="text-sm text-muted-foreground">network health</span>
        </div>

        <ul className="mt-auto space-y-3" aria-label="Road health by segment">
          {segments.map((segment) => (
            <li key={segment.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
              <span className="truncate text-xs font-medium text-foreground/80">{segment.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{segment.score}%</span>
              <div
                role="meter"
                aria-valuenow={segment.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${segment.name} health`}
                className="col-span-2 h-1.5 overflow-hidden rounded-full bg-muted/40"
              >
                <div
                  className={cn("h-full rounded-full transition-all duration-500", healthTone(segment.score))}
                  style={{ width: `${segment.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
