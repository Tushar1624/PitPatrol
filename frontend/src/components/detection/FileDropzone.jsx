import { useCallback, useId, useRef, useState } from "react"
import { CloudUploadIcon, FilmIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Accessible drag-and-drop zone. Keyboard users activate it with
 * Enter/Space which forwards to the hidden file input.
 * All media constraints are configurable; defaults keep the original
 * image-only behaviour intact for existing callers.
 */
export function FileDropzone({
  onFileSelected,
  disabled = false,
  accept = "image/jpeg,image/png,image/webp",
  label = "Drag & drop a road image here, or click to browse",
  hint = "JPG, PNG or WebP — up to 10 MB. Nothing is uploaded in this phase.",
  capabilities,
}) {
  const inputId = useId()
  const labelId = useId()
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openPicker()
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = event.dataTransfer.files?.[0]
    if (file) onFileSelected(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFileSelected(file)
          event.target.value = ""
        }}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-labelledby={labelId}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
          isDragging
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
            : "border-border/50 hover:border-primary/40 hover:bg-muted/20 hover:shadow-md hover:shadow-primary/5",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 items-center justify-center rounded-xl transition-all duration-200",
            isDragging
              ? "bg-primary/20 text-primary shadow-lg shadow-primary/30"
              : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <CloudUploadIcon className="size-6" />
        </span>
        <div id={labelId}>
          <p className="text-sm font-medium text-foreground">
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        {capabilities && (
          <ul className="flex flex-wrap justify-center gap-1.5" aria-label="Supported media">
            {capabilities.map(({ key, label: chipLabel, icon: ChipIcon }) => (
              <li
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
              >
                <ChipIcon aria-hidden="true" className="size-3.5" />
                {chipLabel}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
