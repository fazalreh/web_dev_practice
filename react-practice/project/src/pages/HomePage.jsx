import { useSelector } from 'react-redux'

import { useHealthCheckQuery } from '../app/api/baseApi'
import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { selectAuth } from '../features/auth/authSlice'
import { getRoleLabel } from '../lib/roles'

const stackItems = [
  { label: 'React Router', detail: 'Workspace routes' },
  { label: 'Redux Toolkit', detail: 'Shared state' },
  { label: 'RTK Query', detail: 'Data requests' },
  { label: 'Supabase client', detail: 'Auth and storage' },
]

function HomePage() {
  const { data, isLoading } = useHealthCheckQuery()
  const auth = useSelector(selectAuth)
  const hasInvalidSupabaseConfig = data?.invalidKeys?.length > 0
  const supabaseStatus = data?.configured
    ? 'Ready'
    : hasInvalidSupabaseConfig
      ? 'Invalid'
      : 'Waiting'
  const supabaseTone = data?.configured
    ? 'success'
    : hasInvalidSupabaseConfig
      ? 'danger'
      : 'warning'
  const supabaseRows = [
    {
      label: 'Project URL',
      status: data?.projectHost ?? 'Missing',
      tone: data?.projectHost ? 'success' : 'warning',
    },
    {
      label: 'Anon key',
      status: data?.missingKeys?.includes('VITE_SUPABASE_ANON_KEY')
        ? 'Missing'
        : 'Present',
      tone: data?.missingKeys?.includes('VITE_SUPABASE_ANON_KEY')
        ? 'warning'
        : 'success',
    },
    {
      label: 'Client',
      status: data?.clientReady ? 'Ready' : 'Waiting',
      tone: data?.clientReady ? 'success' : 'warning',
    },
  ]

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
          label="Role"
          meta="Auth metadata"
          tone={auth.role ? 'success' : 'warning'}
          value={auth.role ? getRoleLabel(auth.role) : 'Guest'}
        />
        <SummaryCard
          label="Supabase"
          meta={isLoading ? 'Checking client' : data?.message}
          tone={supabaseTone}
          value={supabaseStatus}
        />
        <SummaryCard label="Routes" meta="Overview, admin, customer" value="3" />
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

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Supabase</p>
          <h2>Configuration</h2>
        </div>
        <div className="task-list">
          {supabaseRows.map((row) => (
            <article className={`task-row ${row.tone}`} key={row.label}>
              <strong>{row.label}</strong>
              <span>{row.status}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
