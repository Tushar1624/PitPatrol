import { ConstructionIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * Shared placeholder for routes that will be implemented in later phases.
 * Keeps every unfinished page visually consistent.
 */
export function RoutePlaceholder({ icon: Icon = ConstructionIcon, title, message }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {message && (
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </div>
        <Badge variant="secondary">Planned — next phase</Badge>
      </CardContent>
    </Card>
  )
}
