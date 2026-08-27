import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--popover-foreground)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
}

export function SeverityDistributionChart({ data }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="85%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={`var(--color-${entry.colorKey})`} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5" aria-label="Severity legend">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: `var(--color-${entry.colorKey})` }}
            />
            <span className="truncate text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums">
              {Math.round((entry.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
