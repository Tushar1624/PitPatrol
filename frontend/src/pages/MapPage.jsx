import { useMemo, useState } from "react"

import { PageHeader } from "@/components/layout/PageHeader"
import { FilterBar, ALL_VALUE, withAllOption } from "@/components/dashboard/FilterBar"
import { RoadMap } from "@/components/map/RoadMap"
import {
  INSPECTION_META,
  ISSUE_TYPES,
  SEVERITIES,
  SEVERITY_META,
} from "@/utils/domain-meta"
import { roads } from "@/data/roads"

// Derived once at module load — never recreated during render (Part F).
const SEVERITY_OPTIONS = withAllOption(
  SEVERITIES.map((value) => ({ value, label: SEVERITY_META[value].label }))
)
const INSPECTION_OPTIONS = withAllOption(
  Object.entries(INSPECTION_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  }))
)
const ALL_ISSUE_TYPES = [
  ...new Set(roads.flatMap((road) => road.issueTypes)),
].sort()

export default function MapPage() {
  const [severityFilter, setSeverityFilter] = useState(ALL_VALUE)
  const [typeFilter, setTypeFilter] = useState(ALL_VALUE)
  const [inspectionFilter, setInspectionFilter] = useState(ALL_VALUE)

  const filteredRoads = useMemo(
    () =>
      roads.filter((road) => {
        const matchesSeverity =
          severityFilter === ALL_VALUE || road.severity === severityFilter
        const matchesType =
          typeFilter === ALL_VALUE || road.issueTypes.includes(typeFilter)
        const matchesInspection =
          inspectionFilter === ALL_VALUE ||
          road.inspectionStatus === inspectionFilter
        return matchesSeverity && matchesType && matchesInspection
      }),
    [severityFilter, typeFilter, inspectionFilter]
  )

  return (
    <div className="page-shell">
      <PageHeader
        title="Map"
        description="Geographic view of the monitored network. Marker colour reflects severity; the number is the open detection count."
      />

      <FilterBar
        filters={[
          {
            id: "severity",
            label: "severity",
            value: severityFilter,
            onChange: setSeverityFilter,
            options: SEVERITY_OPTIONS,
          },
          {
            id: "issue-type",
            label: "issue type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: withAllOption(
              ALL_ISSUE_TYPES.map((type) => ({ value: type, label: type }))
            ),
          },
          {
            id: "inspection",
            label: "inspection status",
            value: inspectionFilter,
            onChange: setInspectionFilter,
            options: INSPECTION_OPTIONS,
          },
        ]}
      />

      <p className="text-muted-note" role="status">
        {`Showing ${filteredRoads.length} of ${roads.length} roads`}
      </p>

      <div className="overflow-hidden rounded-xl border">
        <RoadMap roads={filteredRoads} />
      </div>
    </div>
  )
}
