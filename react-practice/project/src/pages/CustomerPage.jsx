import {
  ArrowUpRight,
  Bell,
  CalendarCheck2,
  CreditCard,
  FileText,
  LifeBuoy,
  MessageSquareText,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { selectAuth } from '../features/auth/authSlice'
import { getRoleLabel, ROLE_LABELS, USER_ROLES } from '../lib/roles'

const customerStats = [
  {
    label: 'Documents',
    meta: 'Ready to view',
    tone: 'success',
    value: '12',
  },
  {
    label: 'Messages',
    meta: 'Unread updates',
    tone: 'warning',
    value: '4',
  },
  {
    label: 'Requests',
    meta: 'In progress',
    value: '2',
  },
]

const nextActions = [
  {
    icon: UploadCloud,
    title: 'Upload profile proof',
    meta: 'Identity document waiting for review',
    status: 'Due today',
    tone: 'warning',
  },
  {
    icon: MessageSquareText,
    title: 'Reply to admin message',
    meta: 'Waleed Khalid requested one account detail',
    status: 'Open',
    tone: 'neutral',
  },
  {
    icon: CalendarCheck2,
    title: 'Confirm service appointment',
    meta: 'Scheduled for the next available slot',
    status: 'New',
    tone: 'success',
  },
]

const recordItems = [
  {
    title: 'Account verification',
    meta: 'Updated today',
    status: 'Pending',
    tone: 'warning',
  },
  {
    title: 'Billing profile',
    meta: 'Synced yesterday',
    status: 'Active',
    tone: 'success',
  },
  {
    title: 'Support history',
    meta: '6 conversations',
    status: 'Open',
    tone: 'neutral',
  },
]

const supportItems = [
  {
    icon: ShieldCheck,
    label: 'Account status',
    value: 'Protected',
  },
  {
    icon: CreditCard,
    label: 'Plan billing',
    value: 'Current',
  },
  {
    icon: LifeBuoy,
    label: 'Support SLA',
    value: '24 hours',
  },
]

function CustomerPage() {
  const auth = useSelector(selectAuth)
  const roleLabel = auth.role ? getRoleLabel(auth.role) : ROLE_LABELS[USER_ROLES.CUSTOMER]
  const accountName =
    auth.user?.user_metadata?.full_name ?? auth.user?.email?.split('@')[0] ?? 'Customer'
  const accountEmail = auth.user?.email ?? 'Signed-in customer'

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <>
            <button className="secondary-action" type="button">
              <FileText aria-hidden="true" size={17} />
              <span>Statement</span>
            </button>
            <button className="primary-action compact-action" type="button">
              <MessageSquareText aria-hidden="true" size={17} />
              <span>Contact support</span>
            </button>
          </>
        }
        description="Personal profile, service requests, messages, and customer records."
        eyebrow={ROLE_LABELS[USER_ROLES.CUSTOMER]}
        title="Customer dashboard"
      />

      <section className="summary-grid" aria-label="Customer summary">
        <SummaryCard label="Role" meta="Workspace scope" tone="success" value={roleLabel} />
        {customerStats.map((stat) => (
          <SummaryCard
            key={stat.label}
            label={stat.label}
            meta={stat.meta}
            tone={stat.tone}
            value={stat.value}
          />
        ))}
      </section>

      <section className="customer-dashboard-grid">
        <div className="dashboard-panel wide-panel">
          <div className="section-heading">
            <p className="eyebrow">Action Center</p>
            <h2>Next steps</h2>
          </div>

          <div className="customer-action-list">
            {nextActions.map((item) => {
              const Icon = item.icon

              return (
                <article className="customer-action-row" key={item.title}>
                  <span className="activity-icon">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <div className="customer-action-main">
                    <strong>{item.title}</strong>
                    <span>{item.meta}</span>
                  </div>
                  <div className="customer-action-meta">
                    <span className={`status-pill ${item.tone}`}>{item.status}</span>
                    <button aria-label={`Open ${item.title}`} className="icon-button" type="button">
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="dashboard-panel customer-profile-panel">
          <div className="section-heading">
            <p className="eyebrow">Profile</p>
            <h2>Account</h2>
          </div>

          <div className="customer-profile-card">
            <span className="customer-avatar">
              <UserRound aria-hidden="true" size={24} />
            </span>
            <div>
              <strong>{accountName}</strong>
              <p>{accountEmail}</p>
            </div>
          </div>

          <div className="profile-detail-list">
            <span>Role</span>
            <strong>{roleLabel}</strong>
            <span>Access</span>
            <strong>Customer portal</strong>
            <span>Security</span>
            <strong>Route protected</strong>
          </div>
        </aside>

        <div className="dashboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Records</p>
            <h2>Customer files</h2>
          </div>

          <div className="record-list">
            {recordItems.map((item) => (
              <article className="record-row" key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
                <span className={`status-pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Messages</p>
            <h2>Latest update</h2>
          </div>

          <article className="message-preview">
            <span className="activity-icon">
              <Bell aria-hidden="true" size={18} />
            </span>
            <div>
              <strong>Admin reviewed your request</strong>
              <p>Your profile proof is being checked. The next update will appear here.</p>
            </div>
          </article>
        </div>

        <div className="dashboard-panel full-panel">
          <div className="section-heading">
            <p className="eyebrow">Service</p>
            <h2>Customer support</h2>
          </div>

          <div className="health-grid">
            {supportItems.map((item) => {
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

export default CustomerPage
