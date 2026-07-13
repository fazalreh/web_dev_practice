import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { selectAuth } from '../features/auth/authSlice'
import { getRoleLabel, ROLE_LABELS, USER_ROLES } from '../lib/roles'

const adminStats = [
  {
    label: 'Customers',
    meta: '+12 this month',
    tone: 'success',
    value: '128',
  },
  {
    label: 'Approvals',
    meta: 'Needs review',
    tone: 'warning',
    value: '7',
  },
  {
    label: 'Records',
    meta: 'Synced today',
    tone: 'success',
    value: '342',
  },
]

const reviewQueue = [
  {
    title: 'Verify Waleed Khalid profile',
    owner: 'Customer onboarding',
    status: 'High',
    due: 'Today',
  },
  {
    title: 'Review customer document update',
    owner: 'Records team',
    status: 'Normal',
    due: 'Tomorrow',
  },
  {
    title: 'Approve admin role request',
    owner: 'Access control',
    status: 'High',
    due: 'Today',
  },
]

const activityItems = [
  {
    icon: CheckCircle2,
    title: 'Customer sync completed',
    meta: '342 records checked',
  },
  {
    icon: UserCog,
    title: 'Role policy refreshed',
    meta: 'Admin and customer access active',
  },
  {
    icon: FileCheck2,
    title: 'Profile queue updated',
    meta: '7 approvals waiting',
  },
]

const healthItems = [
  {
    icon: ShieldCheck,
    label: 'Route guard',
    value: 'Active',
  },
  {
    icon: Activity,
    label: 'Supabase auth',
    value: 'Connected',
  },
  {
    icon: Clock3,
    label: 'Last sync',
    value: 'Just now',
  },
]

function AdminPage() {
  const auth = useSelector(selectAuth)
  const roleLabel = auth.role ? getRoleLabel(auth.role) : ROLE_LABELS[USER_ROLES.ADMIN]

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <>
            <button className="secondary-action" type="button">
              <Download aria-hidden="true" size={17} />
              <span>Export</span>
            </button>
            <button className="primary-action compact-action" type="button">
              <Users aria-hidden="true" size={17} />
              <span>Review customers</span>
            </button>
          </>
        }
        description="Customer oversight, approvals, role requests, and system status."
        eyebrow={ROLE_LABELS[USER_ROLES.ADMIN]}
        title="Admin dashboard"
      />

      <section className="summary-grid" aria-label="Admin summary">
        <SummaryCard label="Role" meta="Workspace scope" tone="success" value={roleLabel} />
        {adminStats.map((stat) => (
          <SummaryCard
            key={stat.label}
            label={stat.label}
            meta={stat.meta}
            tone={stat.tone}
            value={stat.value}
          />
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <div className="dashboard-panel wide-panel">
          <div className="section-heading">
            <p className="eyebrow">Queue</p>
            <h2>Pending review</h2>
          </div>

          <div className="review-list">
            {reviewQueue.map((item) => (
              <article className="review-row" key={item.title}>
                <div className="review-main">
                  <strong>{item.title}</strong>
                  <span>{item.owner}</span>
                </div>
                <div className="review-meta">
                  <span className={item.status === 'High' ? 'priority-pill high' : 'priority-pill'}>
                    {item.status}
                  </span>
                  <span>{item.due}</span>
                  <button aria-label={`Open ${item.title}`} className="icon-button" type="button">
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Activity</p>
            <h2>Recent changes</h2>
          </div>

          <div className="activity-list">
            {activityItems.map((item) => {
              const Icon = item.icon

              return (
                <article className="activity-item" key={item.title}>
                  <span className="activity-icon">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.meta}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="dashboard-panel full-panel">
          <div className="section-heading">
            <p className="eyebrow">Health</p>
            <h2>Admin controls</h2>
          </div>

          <div className="health-grid">
            {healthItems.map((item) => {
              const Icon = item.icon

              return (
                <article className="health-item" key={item.label}>
                  <Icon aria-hidden="true" size={19} />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminPage
