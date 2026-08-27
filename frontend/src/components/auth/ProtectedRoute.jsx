import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

/**
 * Route guard: unauthenticated users are redirected to /login with the
 * intended destination preserved as a query param so login can return
 * them where they wanted to go.
 */
export function ProtectedRoute() {
  const { user, loading, authError } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-xl border border-destructive/40 bg-destructive/[0.03] p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Authentication initialization failed.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please return to the login page and try again.
          </p>
          <a
            href="/login"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to login
          </a>
        </div>
      </div>
    )
  }

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <Outlet />
}