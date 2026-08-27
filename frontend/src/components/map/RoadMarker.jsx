import L from "leaflet"
import { memo } from "react"
import { Marker } from "react-leaflet"

import { RoadPopup } from "@/components/map/RoadPopup"

const SEVERITY_COLORS = {
  critical: "var(--color-destructive)",
  high: "var(--color-warning)",
  medium: "var(--color-chart-1)",
  low: "var(--color-success)",
}

const SEVERITY_ENUM = Object.keys(SEVERITY_COLORS)

/**
 * Coerce untrusted values before they ever reach HTML.
 * Security: backend strings can never become arbitrary HTML here.
 */
export function coerceSeverity(value) {
  const v = String(value ?? "").toLowerCase()
  return SEVERITY_ENUM.includes(v) ? v : SEVERITY_ENUM[2] // medium
}

export function coerceCount(value) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
}

/**
 * Module-level icon cache: one divIcon per severity+count combination,
 * created once. Prevents new Leaflet objects (and marker DOM churn) on
 * every render when filters merely reorder the list.
 */
const iconCache = new Map()

function getRoadIcon(severity, count) {
  const safeSeverity = coerceSeverity(severity)
  const safeCount = coerceCount(count)
  const key = `${safeSeverity}:${safeCount}`
  if (iconCache.has(key)) return iconCache.get(key)

  const color = SEVERITY_COLORS[safeSeverity]
  const pulse =
    safeSeverity === "critical"
      ? '<span aria-hidden="true" style="position:absolute;inset:-6px;border-radius:9999px;border:2px solid var(--color-destructive);opacity:.4;animation:ping 1.6s cubic-bezier(0,0,.2,1) infinite;box-shadow:0 0 8px var(--color-destructive)"></span>'
      : ""

  const icon = L.divIcon({
    className: "!bg-transparent !border-none",
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px">
      ${pulse}
      <span title="${safeSeverity} severity, ${safeCount} detections" aria-hidden="true"
        style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};color:white;font:700 11px/1 system-ui,sans-serif;border:2px solid var(--color-background);box-shadow:0 2px 8px rgba(0,0,0,.5),0 0 12px color-mix(in srgb, ${color} 30%, transparent)">${safeCount}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
  iconCache.set(key, icon)
  return icon
}

/** Severity-coloured marker with detection count; details live in the popup. */
export const RoadMarker = memo(function RoadMarker({ road }) {
  const safeRoad = {
    ...road,
    severity: coerceSeverity(road.severity),
    issueCount: coerceCount(road.issueCount),
  }
  return (
    <Marker
      position={[Number(road.lat), Number(road.lng)]}
      icon={getRoadIcon(safeRoad.severity, safeRoad.issueCount)}
      title={`${road.name ?? ""} — ${safeRoad.issueCount} detections`}
      keyboard
    >
      <RoadPopup road={safeRoad} />
    </Marker>
  )
})