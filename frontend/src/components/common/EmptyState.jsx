import { Button } from "@/components/ui/button"

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 px-6 py-16 text-center">
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-lg shadow-primary/10 ring-1 ring-primary/10">
          <Icon aria-hidden="true" className="size-7" />
        </div>
      )}
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <Button size="sm" asChild>{action}</Button>}
    </div>
  )
}
