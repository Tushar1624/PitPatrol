import { FilmIcon, Image as ImageIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/utils/format"

export function SelectedFileCard({ file, previewUrl, onRemove, disabled }) {
  const isVideo = file.type.startsWith("video/")
  const FallbackIcon = isVideo ? FilmIcon : ImageIcon

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      {!isVideo && previewUrl ? (
        <img
          src={previewUrl}
          alt={`Preview of ${file.name}`}
          className="size-14 shrink-0 rounded-md border object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground"
        >
          <FallbackIcon className="size-5" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
      >
        <XIcon />
      </Button>
    </div>
  )
}
