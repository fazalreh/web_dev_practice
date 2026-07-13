import { Link } from 'react-router-dom'

import PageHeader from '../components/layout/PageHeader'

function NotFoundPage() {
  return (
    <div className="page-stack">
      <PageHeader
        description="The route does not match an active workspace view."
        eyebrow="404"
        title="Page not found"
      />
      <Link className="primary-link" to="/">
        Back to overview
      </Link>
    </div>
  )
}

export default NotFoundPage
