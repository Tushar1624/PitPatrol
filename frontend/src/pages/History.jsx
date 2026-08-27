import { useEffect, useMemo, useState } from "react"
import { SearchXIcon } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { FilterBar, ALL_VALUE, withAllOption } from "@/components/dashboard/FilterBar"
import { DataTable } from "@/components/dashboard/DataTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { Pagination } from "@/components/common/Pagination"
import {
  DETECTION_STATUS_META,
  ISSUE_TYPES,
  SEVERITIES,
  SEVERITY_META,
} from "@/utils/domain-meta"
import { detections } from "@/data/detections"

const PAGE_SIZE = 6

const COLUMNS = [
  {
    key: "detectedAt",
    header: "Date",
    className: "whitespace-nowrap",
    render: (row) => <span className="tabular-nums">{row.detectedAt}</span>,
  },
  { key: "road", header: "Road", className: "font-medium" },
  { key: "issueType", header: "Issue type" },
  {
    key: "confidence",
    header: "Confidence",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="h-1.5 w-14 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${row.confidence}%` }}
          />
        </div>
        <span className="tabular-nums">{`${row.confidence}%`}</span>
      </div>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    render: (row) => <StatusBadge value={row.severity} />,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
]

export default function History() {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState(ALL_VALUE)
  const [statusFilter, setStatusFilter] = useState(ALL_VALUE)
  const [typeFilter, setTypeFilter] = useState(ALL_VALUE)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return detections.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.road.toLowerCase().includes(query) ||
        item.issueType.toLowerCase().includes(query)
      const matchesSeverity =
        severityFilter === ALL_VALUE || item.severity === severityFilter
      const matchesStatus =
        statusFilter === ALL_VALUE || item.status === statusFilter
      const matchesType =
        typeFilter === ALL_VALUE || item.issueType === typeFilter
      return matchesSearch && matchesSeverity && matchesStatus && matchesType
    })
  }, [search, severityFilter, statusFilter, typeFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  // Keep pagination in range whenever filters change.
  useEffect(() => {
    setPage(1)
  }, [search, severityFilter, statusFilter, typeFilter])

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length)

  return (
    <div className="page-shell">
      <PageHeader
        title="Detection History"
        description="Every detection recorded by the platform, with filtering and review status."
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search road or issue type…"
        filters={[
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
          {
            id: "status",
            label: "review status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: withAllOption(
              Object.entries(DETECTION_STATUS_META).map(([value, meta]) => ({
                value,
                label: meta.label,
              }))
            ),
          },
          {
            id: "type",
            label: "issue type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: withAllOption(ISSUE_TYPES.map((type) => ({ value: type, label: type }))),
          },
        ]}
      />

      <p className="text-muted-note" role="status">
        {filtered.length > 0
          ? `Showing ${rangeStart}–${rangeEnd} of ${filtered.length} detections`
          : "No detections match the current filters"}
      </p>

      <DataTable
        columns={COLUMNS}
        rows={pageRows}
        getRowId={(row) => row.id}
        emptyState={
          <EmptyState
            icon={SearchXIcon}
            title="No history found"
            description="Adjust your search or filters to see recorded detections."
          />
        }
      />

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        className="mt-4"
      />
    </div>
  )
}
