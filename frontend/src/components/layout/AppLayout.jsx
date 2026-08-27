import { useCallback, useEffect, useRef, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useIsMobile } from "@/hooks/useIsMobile"

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const openButtonRef = useRef(null)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  // Reset drawer state when crossing the desktop breakpoint.
  useEffect(() => {
    if (!isMobile) setNavOpen(false)
  }, [isMobile])

  // Restore focus to the hamburger button when the drawer closes.
  const closeNav = useCallback(() => {
    setNavOpen((prev) => {
      if (prev) openButtonRef.current?.focus()
      return false
    })
  }, [])

  return (
    <div className="relative flex h-dvh overflow-hidden">
      {/* Subtle futuristic background — radial violet + cyan atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
                radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 70%)
              `,
            }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Sidebar
        open={navOpen && isMobile}
        onClose={closeNav}
        navId="mobile-navigation"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenNav={() => setNavOpen(true)}
          navOpen={navOpen}
          openButtonRef={openButtonRef}
        />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}