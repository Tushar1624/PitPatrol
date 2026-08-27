import { Link } from "react-router-dom"

import { PageHeader } from "@/components/layout/PageHeader"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="page-shell">
      <PageHeader title="Page not found" />
      <ErrorState
        title="404 — This route does not exist"
        message="The page you are looking for was moved, removed or never existed."
      />
      <div>
        <Button asChild>
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
