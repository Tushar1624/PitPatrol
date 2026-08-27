import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import { RoadMarker } from "@/components/map/RoadMarker"
import { MapLegend } from "@/components/map/MapLegend"

const CITY_CENTER = [40.74, -73.98]
const EMPTY_BOUNDS = L.latLngBounds(
  [40.705, -74.02],
  [40.775, -73.94]
)

const TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL ??
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/** Keeps the viewport fitted to the visible (filtered) markers. */
function FitToMarkers({ roads }) {
  const map = useMap()
  const bounds = useMemo(() => {
    if (roads.length === 0) return EMPTY_BOUNDS
    return L.latLngBounds(roads.map((road) => [road.lat, road.lng])).pad(0.18)
  }, [roads])

  useEffect(() => {
    map.fitBounds(bounds, { animate: true, maxZoom: 15 })
  }, [map, bounds])

  return null
}

/**
 * OpenStreetMap base layer with severity-styled road markers.
 * Wheel-zoom is disabled on purpose so the map never hijacks page
 * scrolling — zoom via the +/− controls or keyboard.
 */
export function RoadMap({ roads, ariaLabel = "Road monitoring map" }) {
  return (
    <div className="relative h-[420px] w-full sm:h-[520px]" role="application" aria-label={ariaLabel}>
      <MapContainer
        center={CITY_CENTER}
        zoom={12}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={TILE_URL}
        />
        <FitToMarkers roads={roads} />
        {roads.map((road) => (
          <RoadMarker key={road.id} road={road} />
        ))}
      </MapContainer>
      <MapLegend />
      {roads.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[600] flex items-center justify-center bg-background/70">
          <p className="rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-sm">
            No roads match the current filters
          </p>
        </div>
      )}
    </div>
  )
}
