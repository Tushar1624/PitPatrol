import { useEffect, useState } from "react"

const QUERY = "(max-width: 1023.98px)"

/** Tracks whether the viewport is below the `lg` breakpoint (mobile drawer mode). */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = (event) => setIsMobile(event.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
