/**
 * Detection-class registry.
 *
 * The RF-DETR model may emit raw class names like "pothole", "Pothole",
 * "pothole_large", "D00" etc. Rendering stays configurable: map any raw
 * value through `resolveDetectionClass`, which matches aliases
 * (case/space/underscore-insensitive) and falls back to a neutral style.
 */

export const DETECTION_CLASSES = {
  pothole: {
    label: "Pothole",
    colorVar: "--color-destructive",
    aliases: ["pothole", "pot hole", "potholes", "crater"],
  },
  crack: {
    label: "Crack",
    colorVar: "--color-warning",
    aliases: ["crack", "cracks", "cracking", "linear crack"],
  },
  damaged_surface: {
    label: "Damaged surface",
    colorVar: "--color-chart-1",
    aliases: [
      "damaged surface",
      "surface damage",
      "surface deformation",
      "raveling",
    ],
  },
  road_obstruction: {
    label: "Road obstruction",
    colorVar: "--color-chart-5",
    aliases: [
      "road obstruction",
      "obstruction",
      "debris",
      "foreign object",
    ],
  },
}

const DEFAULT_CLASS = {
  label: null, // falls back to the raw model output
  colorVar: "--color-muted-foreground",
  aliases: [],
}

const LOOKUP = Object.fromEntries(
  Object.entries(DETECTION_CLASSES).flatMap(([key, meta]) =>
    [key, ...meta.aliases].map((alias) => [normalizeClassName(alias), key])
  )
)

function normalizeClassName(raw) {
  return String(raw).toLowerCase().replace(/[\s_-]+/g, " ").trim()
}

/** Resolves a raw model class name to its presentation metadata. */
export function resolveDetectionClass(rawClassName) {
  const key = LOOKUP[normalizeClassName(rawClassName)]
  if (!key) {
    return { key: "other", ...DEFAULT_CLASS, label: rawClassName }
  }
  return { key, ...DETECTION_CLASSES[key] }
}
