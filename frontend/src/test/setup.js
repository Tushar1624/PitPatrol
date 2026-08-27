import "@testing-library/jest-dom"

// jsdom does not implement URL.createObjectURL — stub it for tests.
if (typeof URL.createObjectURL === "undefined") {
  URL.createObjectURL = () => "blob:mock-object-url"
}
if (typeof URL.revokeObjectURL === "undefined") {
  URL.revokeObjectURL = () => {}
}

// matchMedia stub for components/hooks that query the viewport.
if (typeof window.matchMedia === "undefined") {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}