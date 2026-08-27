import { useNavigate } from "react-router-dom"
import { CircleUserIcon, LogOutIcon, SettingsIcon } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"

export function Header({ onOpenNav, navOpen = false, openButtonRef }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 sm:px-6">
      <Button
        ref={openButtonRef}
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenNav}
        aria-label="Open navigation menu"
        aria-expanded={navOpen}
        aria-controls="mobile-navigation"
      >
        <span aria-hidden="true" className="flex flex-col gap-[5px]">
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </span>
      </Button>

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <Badge variant="secondary" className="hidden md:inline-flex">
        v0.3.0
      </Badge>
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open account menu"
            className="rounded-full"
          >
            <CircleUserIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user?.email ?? "Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <CircleUserIcon className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <SettingsIcon className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOutIcon className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
