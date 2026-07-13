import { useSelector } from 'react-redux'

import { useHealthCheckQuery } from '../app/api/baseApi'
import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { selectAuth } from '../features/auth/authSlice'

const stackItems = [
  { label: 'React Router', detail: 'Workspace routes' },
  { label: 'Redux Toolkit', detail: 'Shared state' },
  { label: 'RTK Query', detail: 'Data requests' },
  { label: 'Supabase client', detail: 'Auth and storage' },
]

function HomePage() {
  const { data, isLoading } = useHealthCheckQuery()
  const auth = useSelector(selectAuth)
  const supabaseStatus = data?.configured ? 'Ready' : 'Waiting'

  return (
    <div className="page-stack">
      <PageHeader
        description="Workspace activity, access status, and project structure in one view."
        eyebrow="Overview"
        title="Operations overview"
      />

      <section className="summary-grid" aria-label="Project summary">
        <SummaryCard label="Session" meta="Redux state" value={auth.status} />
        <SummaryCard
          label="Supabase"
          meta={isLoading ? 'Checking client' : 'Client guard'}
          tone={data?.configured ? 'success' : 'warning'}
          value={supabaseStatus}
        />
        <SummaryCard label="Routes" meta="Overview, admin, customer" value="3" />
        <SummaryCard label="Layout" meta="Desktop and mobile" tone="success" value="Ready" />
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Stack</p>
          <h2>Core pieces</h2>
        </div>
        <div className="stack-grid">
          {stackItems.map((item) => (
            <article className="stack-card" key={item.label}>
              <span aria-hidden="true"></span>
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
