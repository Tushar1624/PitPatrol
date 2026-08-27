import { useCallback, useMemo, useState } from "react"

import { ImageCanvasArea } from "@/components/detection/ImageCanvasArea"
import { DetectionOverlay } from "@/components/detection/DetectionOverlay"
import { DetectionLegend } from "@/components/detection/DetectionLegend"
import { DetectionList } from "@/components/detection/DetectionList"
import { DetectionDetails } from "@/components/detection/DetectionDetails"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/utils/format"

/**
 * Container for the detection result view.
 * Owns hover/selection state; children stay presentational, so the
 * overlay and the list can never drift out of sync — they render from
 * the same state and the same detections array.
 */
export function DetectionViewer({ result, imageUrl, mediaKind = "image" }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const onHover = useCallback((id) => setHoveredId(id), [])
  const onSelect = useCallback((id) => setSelectedId(id), [])

  const selected = useMemo(
    () => result.detections.find((d) => d.id === selectedId) ?? null,
    [result.detections, selectedId]
  )

  const criticalCount = useMemo(
    () =>
      result.detections.filter((d) => d.severity === "critical" || d.severity === "high")
      .length,
    [result.detections]
  )

  return (
    <section aria-label="Detection results" className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* Left: canvas + legend */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {`${formatNumber(result.detections.length)} objects found`}
            <span className="sr-only">{`, ${criticalCount} of them high or critical severity`}</span>
            {" · "}
            {result.road}
          </p>
          <Badge variant="outline">{result.modelName}</Badge>
        </div>

        <ImageCanvasArea
          imageUrl={imageUrl}
          imageAlt={`Road surface from ${result.road}`}
          mediaKind={mediaKind}
          detections={result.detections}
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={onHover}
          onSelect={onSelect}
        />
        {mediaKind === "video" && (
          <p className="text-muted-note">
            Boxes are shown for the analysed sample frame — per-frame tracking
            arrives with the RF-DETR integration.
          </p>
        )}
        <DetectionLegend detections={result.detections} />
      </div>

      {/* Right: list + details */}
      <div className="flex min-w-0 flex-col gap-3">
        <DetectionList
          detections={result.detections}
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={onHover}
          onSelect={onSelect}
        />
        <DetectionDetails detection={selected} />
      </div>
    </section>
  )
}

export { DetectionOverlay }
