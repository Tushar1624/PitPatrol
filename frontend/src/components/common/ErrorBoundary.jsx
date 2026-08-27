import { Component } from "react"

import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/common/ErrorState"

/**
 * Last-resort boundary: keeps a render crash from blanking the whole app.
 * Offers a soft reset that remounts the tree without a full page reload.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // Backend phase: forward to the logging service.
    console.error("SMARTROAD AI render error:", error)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4">
            <ErrorState
              title="Something went wrong"
              message="The interface hit an unexpected error. Resetting usually fixes it — if it persists, please report it to the team."
            />
            <div className="flex justify-end">
              <Button onClick={this.handleReset}>Try again</Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
