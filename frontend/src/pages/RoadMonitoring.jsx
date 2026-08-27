import { useMemo, useState } from "react"
import { SearchXIcon } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { FilterBar, ALL_VALUE, withAllOption } from "@/components/dashboard/FilterBar"
import { DataTable } from "@/components/dashboard/DataTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import {
  ROAD_STATUS_META,
  SEVERITIES,
  SEVERITY_META,
} from "@/utils/domain-meta"
import { roads } from "@/data/roads"
import { formatDaysAgo } from "@/utils/format"

const COLUMNS = [
  {
    key: "name",
    header: "Road",
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.name}</span>
        <span className="text-xs text-muted-foreground">
          {`${row.code} · ${row.lengthKm} km`}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    key: "inspectionStatus",
    header: "Inspection",
    render: (row) => <StatusBadge value={row.inspectionStatus} />,
  },
  {
    key: "issueCount",
    header: "Issues",
    className: "text-center",
    render: (row) => (
      <span
        className={
          row.issueCount > 5
            ? "font-semibold tabular-nums text-destructive"
            : "tabular-nums"
        }
      >
        {row.issueCount}
      </span>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    render: (row) => <StatusBadge value={row.severity} />,
  },
  {
    key: "lastInspection",
    header: "Last inspection",
    render: (row) => (
      <span className="text-muted-foreground">
        {formatDaysAgo(row.lastInspection)}
      </span>
    ),
  },
]

export default function RoadMonitoring() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(ALL_VALUE)
  const [severityFilter, setSeverityFilter] = useState(ALL_VALUE)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return roads.filter((road) => {
      const matchesSearch =
        query === "" ||
        road.name.toLowerCase().includes(query) ||
        road.code.toLowerCase().includes(query)
      const matchesStatus =
        statusFilter === ALL_VALUE || road.status === statusFilter
      const matchesSeverity =
        severityFilter === ALL_VALUE || road.severity === severityFilter
      return matchesSearch && matchesStatus && matchesSeverity
    })
  }, [search, statusFilter, severityFilter])

  return (
    <div className="page-shell">
      <PageHeader
        title="Road Monitoring"
        description="Condition and inspection status for every monitored road segment."
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or code…"
        filters={[
          {
            id: "status",
            label: "status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: withAllOption(
              Object.entries(ROAD_STATUS_META).map(([value, meta]) => ({
                value,
                label: meta.label,
              }))
            ),
          },
          {
            id: "severity",
            label: "severity",
            value: severityFilter,
            onChange: setSeverityFilter,
            options: withAllOption(
              SEVERITIES.map((value) => ({
                value,
                label: SEVERITY_META[value].label,
              }))
            ),
          },
        ]}
      />

      <p className="text-muted-note" role="status">
        {`Showing ${filtered.length} of ${roads.length} roads`}
      </p>

      <DataTable
        columns={COLUMNS}
        rows={filtered}
        getRowId={(row) => row.id}
        emptyState={
          <EmptyState
            icon={SearchXIcon}
            title="No roads match your filters"
            description="Try a different search term or reset the status and severity filters."
          />
        }
      />
    </div>
  )
}
