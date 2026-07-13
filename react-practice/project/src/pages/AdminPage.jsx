import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { ROLE_LABELS, USER_ROLES } from '../lib/roles'

const adminQueues = [
  'Profile approvals',
  'Customer records',
  'Role requests',
]

function AdminPage() {
  return (
    <div className="page-stack">
      <PageHeader
        description="Admin queues, customer oversight, and access status."
        eyebrow={ROLE_LABELS[USER_ROLES.ADMIN]}
        title="Admin workspace"
      />

      <section className="summary-grid" aria-label="Admin summary">
        <SummaryCard label="Role" meta="Workspace scope" value="Admin" />
        <SummaryCard label="Queues" meta="Open areas" value="3" />
        <SummaryCard label="Access" meta="Auth pending" tone="warning" value="Pending" />
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Workspace</p>
          <h2>Admin queues</h2>
        </div>
        <div className="task-list">
          {adminQueues.map((queue) => (
            <article className="task-row" key={queue}>
              <strong>{queue}</strong>
              <span>Queued</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminPage
