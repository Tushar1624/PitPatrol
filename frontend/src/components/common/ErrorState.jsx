import { CircleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <Alert variant="destructive" className="border-l-[3px] border-l-destructive">
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message && <p className="leading-relaxed">{message}</p>}
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
