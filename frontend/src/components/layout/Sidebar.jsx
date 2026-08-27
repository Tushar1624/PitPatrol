import { useEffect, useRef } from "react"
import { NavLink } from "react-router-dom"
import logo from "@/assets/logo.svg"
import { NAV_ITEMS } from "@/utils/navigation"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export function Sidebar({ open = false, onClose, navId }) {
  const { user } = useAuth()
  const firstLinkRef = useRef(null)

  // Escape closes the mobile drawer; focus moves into it when it opens.
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)

    // Defer so the drawer is mounted before focusing.
    const frame = window.requestAnimationFrame(() => firstLinkRef.current?.focus())

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.cancelAnimationFrame(frame)
    }
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id={navId}
        role="dialog"
        aria-modal
        aria-label="Primary navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="size-5"
            />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
              SMARTROAD AI
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-sidebar-primary/80">
              Monitoring Suite
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }, index) => (
            <NavLink
              key={to}
              ref={index === 0 ? firstLinkRef : undefined}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-primary/10"
                    : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/90"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-sidebar-primary shadow-[0_0_8px_rgba(167,139,250,0.5)]"
                    />
                  )}
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors duration-200",
                      isActive
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                    )}
                  />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer status */}
        <div className="border-t border-sidebar-border px-4 py-3">
          {user && (
            <p className="mb-2 truncate text-[11px] font-medium text-sidebar-foreground/70">
              {user.email}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-warning shadow-[0_0_6px_rgba(245,158,11,0.6)]"
            />
            <p className="text-[11px] text-sidebar-foreground/50">
              SMARTROAD AI v0.3.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}