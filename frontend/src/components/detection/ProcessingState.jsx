import { LoaderCircleIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"

const IMAGE_STEPS = [
  "Uploading frame to analysis queue",
  "Running pavement defect model",
  "Scoring severity and confidence",
]

const VIDEO_STEPS = [
  "Sampling keyframes from the video",
  "Running pavement defect model per frame",
  "Merging results and scoring confidence",
]

export function ProcessingState({ fileName, mediaKind = "image" }) {
  const steps = mediaKind === "video" ? VIDEO_STEPS : IMAGE_STEPS

  return (
    <div
      className="flex flex-col gap-5 rounded-xl border p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <LoaderCircleIcon aria-hidden="true" className="size-5 animate-spin text-primary" />
        <div>
          <p className="text-sm font-medium">
            Analyzing {fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            Simulated pipeline — no model is connected yet.
          </p>
        </div>
      </div>

      <Progress value={70} aria-label="Analysis progress" />

      <ol className="space-y-2 text-xs text-muted-foreground">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary/60"
            />
            {`Step ${index + 1}: ${step}`}
          </li>
        ))}
      </ol>
    </div>
  )
}
