import { resolveDetectionClass } from "@/utils/detection-classes"

/**
 * Percentage-positioned label chip kept attached to its detection box.
 * Robust placement: boxes on the right half anchor the label's right
 * edge to the box's left edge (label grows leftward), so labels never
 * detach from mid/right boxes. Conservative guards prevent overflow past
 * the image edges in either direction.
 */
function BoxLabel({ detection, active }) {
  const meta = resolveDetectionClass(detection.className)
  const leftPct = detection.bbox.x * 100
  const useRightAnchor = leftPct > 50

  const style =
    useRightAnchor
      ? { right: `${Math.max(100 - leftPct, 4)}%` }
      : { left: `${Math.min(leftPct, 92)}%` }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 flex max-w-[80%] -translate-y-full items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold leading-none text-white shadow-lg transition-all duration-150 ${
        active ? "opacity-100 scale-100" : "opacity-80 scale-95"
      }`}
      style={{
        ...style,
        top: `${detection.bbox.y * 100}%`,
        background: `var(${meta.colorVar})`,
        boxShadow: `0 4px 12px color-mix(in srgb, var(${meta.colorVar}) 40%, transparent)`,
      }}
    >
      <span className="truncate">{meta.label ?? detection.className}</span>
      <span className="opacity-80">{Math.round(detection.confidence * 100)}%</span>
    </div>
  )
}

/**
 * SVG bounding-box layer stretched over the image.
 * viewBox "0 0 1 1" + preserveAspectRatio="none" means normalized bbox
 * coordinates map 1:1 onto the rendered box at ANY size.
 */
export function DetectionOverlay({ detections, hoveredId, selectedId, onHover, onSelect }) {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="group"
        aria-label={`${detections.length} detection bounding boxes`}
      >
        {detections.map((detection) => {
          const meta = resolveDetectionClass(detection.className)
          const isHovered = hoveredId === detection.id
          const isSelected = selectedId === detection.id
          const { x, y, width, height } = detection.bbox

          return (
            <rect
              key={detection.id}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={`var(${meta.colorVar})`}
              fillOpacity={isSelected ? 0.2 : isHovered ? 0.15 : 0.06}
              stroke={`var(${meta.colorVar})`}
              strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.25}
              strokeDasharray={isSelected ? "6 3" : undefined}
              vectorEffect="non-scaling-stroke"
              tabIndex={0}
              role="button"
              aria-label={`${meta.label ?? detection.className}, confidence ${Math.round(
                detection.confidence * 100
              )} percent, severity ${detection.severity}${isSelected ? ", selected" : ""}`}
              aria-pressed={isSelected}
              className="cursor-pointer outline-none transition-all duration-150 focus-visible:stroke-white focus-visible:stroke-[3px]"
              onMouseEnter={() => onHover(detection.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(detection.id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(isSelected ? null : detection.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onSelect(isSelected ? null : detection.id)
                }
              }}
            />
          )
        })}
      </svg>

      {detections.map((detection) => {
        const active =
          hoveredId === detection.id || selectedId === detection.id
        if (!active && detections.length > 8) return null
        return (
          <BoxLabel key={detection.id} detection={detection} active={active} />
        )
      })}
    </div>
  )
}
