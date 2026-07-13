import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { ROLE_LABELS, USER_ROLES } from '../lib/roles'

const customerAreas = ['Profile', 'Records', 'Messages']

function CustomerPage() {
  return (
    <div className="page-stack">
      <PageHeader
        description="Customer profile, records, and message activity."
        eyebrow={ROLE_LABELS[USER_ROLES.CUSTOMER]}
        title="Customer workspace"
      />

      <section className="summary-grid" aria-label="Customer summary">
        <SummaryCard label="Role" meta="Workspace scope" value="Customer" />
        <SummaryCard label="Areas" meta="Account sections" value="3" />
        <SummaryCard label="Access" meta="Auth pending" tone="warning" value="Pending" />
      </section>

      <section className="content-section">
        <div className="section-heading">
          <p className="eyebrow">Workspace</p>
          <h2>Customer areas</h2>
        </div>
        <div className="task-list">
          {customerAreas.map((area) => (
            <article className="task-row" key={area}>
              <strong>{area}</strong>
              <span>Ready</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CustomerPage
