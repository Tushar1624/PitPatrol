import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Wrapper giving every chart the same frame and a fixed content height
 * so Recharts ResponsiveContainer can size itself consistently.
 */
export function ChartCard({ title, description, action, children, height = 288 }) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>
        <div style={{ height }} role="img" aria-label={`${title} chart`}>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
