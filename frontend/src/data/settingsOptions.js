/**
 * MOCK — settings option definitions.
 * Preference values are stored locally until user accounts exist.
 */

export const notificationOptions = [
  {
    id: "notify-critical",
    label: "Critical alerts",
    description: "Immediate notifications when a critical issue is detected.",
    defaultChecked: true,
  },
  {
    id: "notify-daily",
    label: "Daily summary",
    description: "One email per day with detection counts and road health.",
    defaultChecked: true,
  },
  {
    id: "notify-inspections",
    label: "Inspection reminders",
    description: "Remind me before a scheduled inspection is due.",
    defaultChecked: false,
  },
]

export const applicationOptions = [
  {
    id: "refresh-interval",
    label: "Live data refresh interval",
    description: "How often dashboard widgets reload once the API is live.",
    type: "select",
    defaultValue: "30s",
    choices: ["15s", "30s", "1m", "5m"],
  },
  {
    id: "default-landing",
    label: "Default landing page",
    description: "The view shown after opening SMARTROAD AI.",
    type: "select",
    defaultValue: "/",
    choices: [
      { value: "/", label: "Dashboard" },
      { value: "/roads", label: "Road Monitoring" },
      { value: "/detection", label: "Detection" },
    ],
  },
  {
    id: "units",
    label: "Measurement units",
    description: "Applies to distances across the platform.",
    type: "select",
    defaultValue: "metric",
    choices: [
      { value: "metric", label: "Metric (km)" },
      { value: "imperial", label: "Imperial (mi)" },
    ],
  },
]

export const interfaceOptions = [
  {
    id: "table-density",
    label: "Table density",
    description: "Compact mode fits more rows on screen.",
    type: "select",
    defaultValue: "comfortable",
    choices: [
      { value: "comfortable", label: "Comfortable" },
      { value: "compact", label: "Compact" },
    ],
  },
  {
    id: "reduce-motion",
    label: "Reduce motion",
    description: "Minimise chart and panel animations.",
    type: "toggle",
    defaultChecked: false,
  },
]
