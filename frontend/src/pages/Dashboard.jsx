import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRightIcon,
  CircleAlertIcon,
  ClipboardCheckIcon,
  RadarIcon,
  RouteIcon,
} from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { SectionHeader } from "@/components/dashboard/SectionHeader"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { DataTable } from "@/components/dashboard/DataTable"
import { ChartCard } from "@/components/dashboard/ChartCard"
import { AlertCard } from "@/components/dashboard/AlertCard"
import { RoadHealthOverview } from "@/components/dashboard/RoadHealthOverview"
import { DetectionTrendChart } from "@/components/dashboard/charts/DetectionTrendChart"
import { SeverityDistributionChart } from "@/components/dashboard/charts/SeverityDistributionChart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dashboardStats } from "@/data/stats"
import { overallRoadHealth, roadHealthSegments } from "@/data/roads"
import {
  criticalAlerts,
  detections,
  detectionTrend,
  severityDistribution,
} from "@/data/detections"

const RECENT_COLUMNS = [
  {
    key: "detectedAt",
    header: "Date",
    render: (row) => <span className="tabular-nums">{row.detectedAt}</span>,
  },
  { key: "road", header: "Road" },
  { key: "issueType", header: "Issue type" },
  {
    key: "confidence",
    header: "Confidence",
    render: (row) => (
      <span className="tabular-nums">{`${row.confidence}%`}</span>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    render: (row) => <StatusBadge value={row.severity} />,
  },
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)

  const simulateRefresh = () => {
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 900)
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Operations Dashboard"
        description="Live overview of the monitored road network. Metrics are mock data until the backend is connected."
      >
        <Button variant="outline" onClick={simulateRefresh}>
          Refresh data
        </Button>
        <Button asChild>
          <Link to="/detection">New detection</Link>
        </Button>
      </PageHeader>

      {/* Key statistics */}
      <section aria-label="Key statistics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total roads"
            value={dashboardStats.totalRoads}
            icon={RouteIcon}
          />
          <StatCard
            label="Roads inspected"
            value={dashboardStats.roadsInspected}
            delta={dashboardStats.deltas.roadsInspected}
            icon={ClipboardCheckIcon}
            tone="success"
          />
          <StatCard
            label="Total detections"
            value={dashboardStats.totalDetections}
            delta={dashboardStats.deltas.totalDetections}
            icon={RadarIcon}
          />
          <StatCard
            label="Critical issues"
            value={dashboardStats.criticalIssues}
            delta={dashboardStats.deltas.criticalIssues}
            icon={CircleAlertIcon}
            tone="destructive"
          />
        </div>
      </section>

      {/* Trend + road health */}
      <section aria-label="Trends" className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="Detection trend"
            description="Daily detections and critical share — last 14 days (mock)"
            height={288}
          >
            <DetectionTrendChart data={detectionTrend} />
          </ChartCard>
        </div>
        <RoadHealthOverview
          overall={overallRoadHealth}
          segments={roadHealthSegments}
        />
      </section>

      {/* Severity + alerts */}
      <section aria-label="Severity and alerts" className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Severity distribution"
          description="Share of detections by severity (mock)"
          height={264}
        >
          <SeverityDistributionChart data={severityDistribution} />
        </ChartCard>

        <div className="flex flex-col gap-3 xl:col-span-2">
          <SectionHeader
            title="Critical road alerts"
            description="Highest-priority issues requiring attention"
          />
          <div className="flex flex-col gap-3">
            {criticalAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                action={
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/roads">Inspect</Link>
                  </Button>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent detections */}
      <section aria-label="Recent detections">
        <SectionHeader
          title="Recent detections"
          description="Latest six records from the analysis pipeline"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">
                View all
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <DataTable
          columns={RECENT_COLUMNS}
          rows={detections.slice(0, 6)}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          emptyState={
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No detections recorded yet.
            </p>
          }
        />
      </section>
    </div>
  )
}
