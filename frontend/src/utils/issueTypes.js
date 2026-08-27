/**
 * Canonical issue-type vocabulary.
 * Maps backend values → normalized canonical keys → UI labels.
 * Every component uses this single source of truth.
 */

const CANONICAL_MAP = {
  // Backend value (lowercased) → canonical key
  "pothole": "pothole",
  "surface_damage": "surface_damage",
  "surface damage": "surface_damage",
  "surface deformation": "surface_damage",
  "surface-damage": "surface_damage",
  "crack": "crack",
  "longitudinal_crack": "crack",
  "transverse_crack": "crack",
  "alligator_crack": "crack",
  "cracking": "crack",
  "fading": "fading",
  "lane_marking_fading": "fading",
  "marking_fading": "fading",
  "water_puddle": "water_puddle",
  "water pooling": "water_puddle",
  "water-pooling": "water_puddle",
  "debris": "debris",
  "road_debris": "debris",
  "obstacle": "debris",
  "manhole": "manhole",
  "manhole_cover": "manhole",
  "patch": "patch",
  "road_patch": "patch",
  "rutting": "rutting",
  "grooving": "rutting",
  "edge_deterioration": "edge_deterioration",
  "shoulder_damage": "edge_deterioration",
}

const CANONICAL_LABELS = {
  pothole: "Pothole",
  surface_damage: "Surface damage",
  crack: "Crack",
  fading: "Fading",
  water_puddle: "Water puddle",
  debris: "Debris",
  manhole: "Manhole",
  patch: "Patch",
  rutting: "Rutting",
  edge_deterioration: "Edge deterioration",
}

/**
 * Normalize any backend issue-type string to its canonical key.
 * Resolves exact matches, known aliases, and compound class names
 * (e.g. "pothole_large" → "pothole", "linear_crack" → "crack").
 * Returns "other" for unrecognized values.
 */
export function normalizeIssueType(raw) {
  if (!raw || typeof raw !== "string") return "other"

  const value = raw.toLowerCase().trim()
  if (!value) return "other"

  // Exact match or documented alias
  const exact = CANONICAL_MAP[value]
  if (exact) return exact

  // Compound/class-name resolution: match the longest known key
  // contained in the value (handles suffixes like _large, _zone, _faded).
  let best = null
  let bestLength = 0
  for (const key of Object.keys(CANONICAL_MAP)) {
    if (key.includes(" ")) continue // skip phrases; must be a real token
    if (value.includes(key) && key.length > bestLength) {
      best = CANONICAL_MAP[key]
      bestLength = key.length
    }
  }
  return best ?? "other"
}

/**
 * Get a human-readable label for a canonical issue type.
 */
export function getIssueTypeLabel(canonical) {
  return CANONICAL_LABELS[canonical] ?? canonical
}

/**
 * Get the canonical list of all known issue types (for filters, etc.)
 */
export const ISSUE_TYPES = [
  "pothole",
  "surface_damage",
  "crack",
  "fading",
  "water_puddle",
  "debris",
  "manhole",
  "patch",
  "rutting",
  "edge_deterioration",
]

/**
 * Legacy alias — components that imported from domain-meta can keep
 * working while we migrate. Can be removed after full migration.
 */
export const CANONICAL_ISSUE_TYPES = ISSUE_TYPES
