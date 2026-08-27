import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from "@/context/AuthContext"

function renderProtected(initialEntry = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<p>PROTECTED CONTENT</p>} />
        </Route>
        <Route path="login" element={<p>LOGIN PAGE</p>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("ProtectedRoute", () => {
  it("shows a loading state while auth is resolving", () => {
    useAuth.mockReturnValue({ user: null, loading: true, authError: null })
    renderProtected()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
    expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument()
  })

  it("redirects unauthenticated users to /login", () => {
    useAuth.mockReturnValue({ user: null, loading: false, authError: null })
    renderProtected()
    expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument()
    expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument()
  })

  it("renders protected content for an authenticated user", () => {
    useAuth.mockReturnValue({
      user: { email: "a@b.com" },
      loading: false,
      authError: null,
    })
    renderProtected()
    expect(screen.getByText("PROTECTED CONTENT")).toBeInTheDocument()
  })

  it("shows an error state when auth initialization fails", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      authError: "Boom",
    })
    renderProtected()
    expect(screen.getByText(/Authentication initialization failed/i)).toBeInTheDocument()
    expect(screen.queryByText("PROTECTED CONTENT")).not.toBeInTheDocument()
  })
})