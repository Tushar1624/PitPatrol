import { LoaderCircleIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"

/**
 * Brief state between picking a file and "analysis" — mirrors a real upload.
 * `progress` (0–100) is owned by the page so videos can ramp slower than images.
 */
export function UploadingState({ fileName, progress = 45, kindLabel = "Uploading" }) {
  return (
    <div
      className="flex flex-col gap-5 rounded-xl border p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <LoaderCircleIcon aria-hidden="true" className="size-5 animate-spin text-primary" />
        <div>
          <p className="text-sm font-medium">{`${kindLabel} ${fileName}`}</p>
          <p className="text-xs text-muted-foreground">
            Simulated transfer — the file never leaves your browser.
          </p>
        </div>
        <span className="ml-auto text-sm font-medium tabular-nums">{`${Math.round(progress)}%`}</span>
      </div>

      <Progress value={progress} aria-label={`${kindLabel} progress`} />
    </div>
  )
}
