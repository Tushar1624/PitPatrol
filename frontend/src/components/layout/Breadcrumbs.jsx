import { Link, useLocation } from "react-router-dom"
import { ChevronRightIcon } from "lucide-react"

import { NAV_ITEMS, getNavItemForPath } from "@/utils/navigation"

function getCrumbs(pathname) {
  const crumbs = [{ label: "Dashboard", to: "/" }]
  if (pathname === "/") return crumbs

  const current = getNavItemForPath(pathname)
  if (current) {
    crumbs.push({ label: current.label, to: current.to })
    return crumbs
  }

  crumbs.push({ label: "Not found", to: pathname })
  return crumbs
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const crumbs = getCrumbs(pathname)
  const last = crumbs.length - 1

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) =>
          index === last ? (
            <li
              key={crumb.to}
              aria-current="page"
              className="min-w-0 truncate font-medium text-foreground"
            >
              {crumb.label}
            </li>
          ) : (
            <li key={crumb.to} className="hidden items-center gap-1 sm:flex">
              <Link
                to={crumb.to}
                className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {crumb.label}
              </Link>
              <ChevronRightIcon
                aria-hidden="true"
                className="size-3.5 shrink-0 opacity-60"
              />
            </li>
          )
        )}
      </ol>
    </nav>
  )
}

export { NAV_ITEMS }
