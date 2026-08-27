import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import logo from "@/assets/logo.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"

export default function Login() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const params = new URLSearchParams(location.search)
  const redirect = params.get("redirect")
  const sessionExpired = params.get("expired") === "1"

  if (user) {
    return <Navigate to={redirect ? decodeURIComponent(redirect) : "/"} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: authError } = await signIn(email, password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    navigate(redirect ? decodeURIComponent(redirect) : "/")
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30 shadow-lg shadow-primary/10">
            <img src={logo} alt="" aria-hidden="true" className="size-7" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              SMARTROAD AI
            </h1>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Monitoring Suite
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-xl shadow-black/20">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Sign in</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your credentials to access the dashboard.
          </p>

          {sessionExpired && (
            <Alert className="mb-4 border-warning/40 bg-warning/5 text-warning">
              Your session expired. Please sign in again.
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4" role="alert">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
