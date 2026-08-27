import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Loader2Icon } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import logo from "@/assets/logo.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"

export default function Signup() {
  const { user, signUp } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    const { data, error: authError } = await signUp(email, password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data?.user?.identities?.length === 0) {
      setError("An account with this email already exists.")
      setLoading(false)
      return
    }

    setSuccess("Check your email to confirm your account before signing in.")
    setLoading(false)
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
          <h2 className="mb-1 text-lg font-semibold text-foreground">Create account</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Set up your account to start monitoring roads.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-primary/30 bg-primary/5 text-primary">
              {success}
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
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
