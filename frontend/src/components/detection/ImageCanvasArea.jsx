import { DetectionOverlay } from "@/components/detection/DetectionOverlay"

/**
 * Media + overlay container. The <svg> overlay is absolutely positioned
 * over the exact same box as the media element, so normalized coordinates
 * stay aligned through any resize (see DetectionOverlay for the transform).
 * `mediaKind="video"` swaps the <img> for a paused-first-frame <video>.
 */
export function ImageCanvasArea({
  imageUrl,
  imageAlt,
  mediaKind = "image",
  detections,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
}) {
  return (
    <figure className="relative overflow-hidden rounded-xl border bg-muted">
      {mediaKind === "video" ? (
        <video
          src={imageUrl}
          aria-label={imageAlt}
          className="block h-auto w-full select-none"
          controls
          preload="metadata"
          playsInline
        />
      ) : (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="block h-auto w-full select-none"
          draggable="false"
        />
      )}
      <DetectionOverlay
        detections={detections}
        hoveredId={hoveredId}
        selectedId={selectedId}
        onHover={onHover}
        onSelect={onSelect}
      />
      <figcaption className="sr-only">
        {`${detections.length} detections overlaid on ${imageAlt}`}
      </figcaption>
    </figure>
  )
}
