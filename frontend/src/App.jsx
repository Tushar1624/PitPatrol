import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider } from "@/context/AuthContext"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import NotFound from "@/pages/NotFound"

const Dashboard = lazy(() => import("@/pages/Dashboard"))
const RoadMonitoring = lazy(() => import("@/pages/RoadMonitoring"))
const Detection = lazy(() => import("@/pages/Detection"))
const MapPage = lazy(() => import("@/pages/MapPage"))
const History = lazy(() => import("@/pages/History"))
const Reports = lazy(() => import("@/pages/Reports"))
const Settings = lazy(() => import("@/pages/Settings"))
const Login = lazy(() => import("@/pages/Login"))
const Signup = lazy(() => import("@/pages/Signup"))

function RouteFallback() {
  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading page...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="roads" element={<RoadMonitoring />} />
                    <Route path="detection" element={<Detection />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="history" element={<History />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}