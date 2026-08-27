import { useMemo, useState } from "react"
import { CalendarDaysIcon, DownloadIcon, FileTextIcon, SearchXIcon } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { FilterBar, ALL_VALUE, withAllOption } from "@/components/dashboard/FilterBar"
import { SectionHeader } from "@/components/dashboard/SectionHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { ChartCard } from "@/components/dashboard/ChartCard"
import { IssueTypeDistributionChart } from "@/components/dashboard/charts/IssueTypeDistributionChart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ISSUE_TYPES } from "@/utils/domain-meta"
import { issueTypeDistribution } from "@/data/detections"
import { reportSummary, reports } from "@/data/reports"

const PERIODS = [
  { value: "all", label: "All periods" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
]

export default function Reports() {
  const [period, setPeriod] = useState("all")
  const [severityFilter, setSeverityFilter] = useState(ALL_VALUE)
  const [typeFilter, setTypeFilter] = useState(ALL_VALUE)

  const filtered = useMemo(() => {
    return reports.filter((report) => {
      const matchesPeriod =
        period === "all" ||
        (period === "week" && report.type === "Weekly") ||
        (period === "month" && (report.type === "Monthly" || report.type === "Custom"))
      const matchesSeverity =
        severityFilter === ALL_VALUE || report.critical >= Number(severityFilter)
      const matchesType =
        typeFilter === ALL_VALUE ||
        report.title.toLowerCase().includes(typeFilter.toLowerCase()) ||
        report.topIssue.toLowerCase() === typeFilter.toLowerCase()
      return matchesPeriod && matchesSeverity && matchesType
    })
  }, [period, severityFilter, typeFilter])

  return (
    <div className="page-shell">
      <PageHeader
        title="Reports"
        description="Generated summaries of detections and road condition. Export becomes available with the backend phase."
      />

      <section aria-label="Report summary metrics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={reportSummary[0].label} value={reportSummary[0].value} icon={FileTextIcon} />
          <StatCard label={reportSummary[1].label} value={reportSummary[1].value} icon={CalendarDaysIcon} tone="success" />
          <StatCard label={reportSummary[2].label} value={reportSummary[2].value} icon={SearchXIcon} tone="warning" />
          <StatCard label={reportSummary[3].label} value={reportSummary[3].value} icon={DownloadIcon} tone="destructive" />
        </div>
      </section>

      <FilterBar
        filters={[
          {
            id: "period",
            label: "date range",
            value: period,
            onChange: setPeriod,
            options: PERIODS,
          },
          {
            id: "severity",
            label: "minimum critical issues",
            value: severityFilter,
            onChange: setSeverityFilter,
            options: withAllOption([
              { value: "10", label: "10+ critical" },
              { value: "20", label: "20+ critical" },
            ]),
          },
          {
            id: "type",
            label: "issue type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: withAllOption(
              ISSUE_TYPES.map((type) => ({ value: type, label: type }))
            ),
          },
        ]}
      />

      <p className="text-muted-note" role="status">
        {`Showing ${filtered.length} of ${reports.length} reports`}
      </p>

      {filtered.length > 0 ? (
        <section aria-label="Report list">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((report) => (
              <Card key={report.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <StatusBadge
                      value={
                        report.critical >= 10 ? "critical" : report.critical >= 3 ? "high" : "medium"
                      }
                    />
                  </div>
                  <CardTitle className="pt-1 leading-snug">{report.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{report.period}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <dl className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-muted/60 px-2 py-2">
                      <dt className="text-[11px] text-muted-foreground">Issues</dt>
                      <dd className="mt-0.5 text-sm font-semibold tabular-nums">{report.totalIssues}</dd>
                    </div>
                    <div className="rounded-md bg-muted/60 px-2 py-2">
                      <dt className="text-[11px] text-muted-foreground">Critical</dt>
                      <dd className="mt-0.5 text-sm font-semibold tabular-nums text-destructive">{report.critical}</dd>
                    </div>
                    <div className="rounded-md bg-muted/60 px-2 py-2">
                      <dt className="truncate text-[11px] text-muted-foreground">Top issue</dt>
                      <dd className="mt-0.5 truncate text-sm font-medium">{report.topIssue}</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" disabled title="Available after backend integration">
                    <DownloadIcon aria-hidden="true" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" disabled title="Available after backend integration">
                    <DownloadIcon aria-hidden="true" />
                    CSV
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          icon={SearchXIcon}
          title="No reports match your filters"
          description="Try widening the date range or clearing the severity and issue-type filters."
        />
      )}

      <section aria-label="Issue type distribution" className="pt-2">
        <SectionHeader
          title="Issue type distribution"
          description="All-time detection counts per defect category (mock)"
        />
        <ChartCard title="Detections by issue type" height={288}>
          <IssueTypeDistributionChart data={issueTypeDistribution} />
        </ChartCard>
      </section>
    </div>
  )
}
