import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Card, CardContent } from "@/components/ui/card"

export function QuickLinkCard({ to, icon: Icon, title, description }) {
  return (
    <Card className="group h-full gap-0 py-0 transition-colors hover:border-primary/40">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-4.5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
          Open
          <ArrowRightIcon
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </span>
        <Link
          to={to}
          className="absolute inset-0 rounded-xl"
          aria-label={`Go to ${title}`}
        />
      </CardContent>
    </Card>
  )
}
