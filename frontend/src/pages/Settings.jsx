import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BellIcon,
  CheckIcon,
  CogIcon,
  InfoIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PanelsTopLeftIcon,
  ShieldIcon,
  SunIcon,
} from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  applicationOptions,
  interfaceOptions,
  notificationOptions,
} from "@/data/settingsOptions"

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

function SettingRow({ label, description, control, htmlFor }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3.5 last:border-b-0">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  // Local-only preferences until accounts + persistence exist.
  const [notifications, setNotifications] = useState(() =>
    Object.fromEntries(
      notificationOptions.map((option) => [option.id, option.defaultChecked])
    )
  )
  const [appPrefs, setAppPrefs] = useState(() =>
    Object.fromEntries(applicationOptions.map((option) => [option.id, option.defaultValue]))
  )
  const [uiPrefs, setUiPrefs] = useState(() => ({
    "table-density": interfaceOptions.find((o) => o.id === "table-density").defaultValue,
    "reduce-motion": interfaceOptions.find((o) => o.id === "reduce-motion").defaultChecked,
  }))

  return (
    <div className="page-shell">
      <PageHeader
        title="Settings"
        description="Preferences are stored in this browser only during the foundation phase."
      />

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            Account
          </CardTitle>
          <CardDescription>Your account information and session.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {user?.email ?? "Not signed in"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Signed in via Supabase Auth
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOutIcon className="size-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Choose how SMARTROAD AI looks on this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div role="radiogroup" aria-label="Theme" className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
              const selected = theme === value
              return (
                <Button
                  key={value}
                  role="radio"
                  aria-checked={selected}
                  variant={selected ? "default" : "outline"}
                  onClick={() => setTheme(value)}
                >
                  <Icon className="size-4" />
                  {label}
                  {selected && <CheckIcon className="size-4" />}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            Notifications
          </CardTitle>
          <CardDescription>
            Delivery channels are activated together with the backend phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {notificationOptions.map((option) => (
            <SettingRow
              key={option.id}
              htmlFor={option.id}
              label={option.label}
              description={option.description}
              control={
                <Switch
                  id={option.id}
                  checked={notifications[option.id]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [option.id]: checked }))
                  }
                  aria-label={option.label}
                />
              }
            />
          ))}
        </CardContent>
      </Card>

      {/* Application preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CogIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            Application
          </CardTitle>
          <CardDescription>Defaults applied across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {applicationOptions.map((option) => (
            <SettingRow
              key={option.id}
              htmlFor={`${option.id}-select`}
              label={option.label}
              description={option.description}
              control={
                <Select
                  value={appPrefs[option.id]}
                  onValueChange={(value) =>
                    setAppPrefs((prev) => ({ ...prev, [option.id]: value }))
                  }
                >
                  <SelectTrigger
                    id={`${option.id}-select`}
                    className="w-44"
                    aria-label={option.label}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {option.choices.map((choice) => (
                      <SelectItem
                        key={typeof choice === "string" ? choice : choice.value}
                        value={typeof choice === "string" ? choice : choice.value}
                      >
                        {typeof choice === "string" ? choice : choice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            />
          ))}
        </CardContent>
      </Card>

      {/* Interface preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PanelsTopLeftIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            Interface
            <Badge variant="secondary">Preview</Badge>
          </CardTitle>
          <CardDescription>Fine-tune how dense and animated the UI feels.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {interfaceOptions.map((option) => (
            <SettingRow
              key={option.id}
              htmlFor={
                option.type === "toggle" ? option.id : `${option.id}-select`
              }
              label={option.label}
              description={option.description}
              control={
                option.type === "toggle" ? (
                  <Switch
                    id={option.id}
                    checked={uiPrefs[option.id]}
                    onCheckedChange={(checked) =>
                      setUiPrefs((prev) => ({ ...prev, [option.id]: checked }))
                    }
                    aria-label={option.label}
                  />
                ) : (
                  <Select
                    value={uiPrefs[option.id]}
                    onValueChange={(value) =>
                      setUiPrefs((prev) => ({ ...prev, [option.id]: value }))
                    }
                  >
                    <SelectTrigger
                      id={`${option.id}-select`}
                      className="w-44"
                      aria-label={option.label}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {option.choices.map((choice) => (
                        <SelectItem key={choice.value} value={choice.value}>
                          {choice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }
            />
          ))}
        </CardContent>
      </Card>

      {/* About dialog (kept from Part 1) */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Platform and build information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <InfoIcon aria-hidden="true" className="size-4" />
                About SMARTROAD AI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>SMARTROAD AI</DialogTitle>
                <DialogDescription>
                  Smart-road monitoring platform — v0.3.0.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This phase adds complete page UIs driven by mock data. AI
                detection, live data, maps and report exports arrive with the
                backend integration.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
