const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date)
}

const numberFormatter = new Intl.NumberFormat("en-US")

export function formatNumber(value) {
  return numberFormatter.format(value ?? 0)
}

/** "12 Aug 2026" -> "3 days ago" relative to now. */
export function formatDaysAgo(value, now = new Date()) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  const days = Math.round((now.getTime() - date.getTime()) / 86_400_000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "—"
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}
