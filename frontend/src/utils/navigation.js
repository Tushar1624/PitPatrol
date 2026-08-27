import {
  ChartColumn,
  LayoutDashboard,
  Map,
  Radar,
  RotateCcwClock,
  Route,
  Settings,
} from "lucide-react"

export const NAV_ITEMS = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Road Monitoring", to: "/roads", icon: Route },
  { label: "Detection", to: "/detection", icon: Radar },
  { label: "Map", to: "/map", icon: Map },
  { label: "History", to: "/history", icon: RotateCcwClock },
  { label: "Reports", to: "/reports", icon: ChartColumn },
  { label: "Settings", to: "/settings", icon: Settings },
]

/** Resolves the nav entry matching a pathname (exact match first). */
export function getNavItemForPath(pathname) {
  return (
    NAV_ITEMS.find((item) =>
      item.end ? item.to === pathname : item.to === pathname
    ) ?? null
  )
}
