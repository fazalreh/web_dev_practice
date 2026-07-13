import {
  ArrowUpRight,
  Bell,
  CalendarCheck2,
  CreditCard,
  FileText,
  LifeBuoy,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { useGetCustomerDashboardQuery } from '../app/api/baseApi'
import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { selectAuth } from '../features/auth/authSlice'
import ServiceRequestsPanel from '../features/requests/ServiceRequestsPanel'
import { getRoleLabel, ROLE_LABELS, USER_ROLES } from '../lib/roles'

const actionIcons = {
  calendar: CalendarCheck2,
  message: MessageSquareText,
  upload: UploadCloud,
}

const messageIcons = {
  bell: Bell,
}

const supportIcons = {
  card: CreditCard,
  shield: ShieldCheck,
  support: LifeBuoy,
}

function CustomerPage() {
  const auth = useSelector(selectAuth)
  const roleLabel = auth.role ? getRoleLabel(auth.role) : ROLE_LABELS[USER_ROLES.CUSTOMER]
  const {
    data: dashboard,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetCustomerDashboardQuery({
    email: auth.user?.email,
    fullName: auth.user?.user_metadata?.full_name,
    roleLabel,
  })
  const customerStats = dashboard?.stats ?? []
  const nextActions = dashboard?.nextActions ?? []
  const recordItems = dashboard?.records ?? []
  const supportItems = dashboard?.supportItems ?? []
  const latestMessage = dashboard?.message
  const accountName = dashboard?.profile?.name ?? 'Customer'
  const accountEmail = dashboard?.profile?.email ?? 'Signed-in customer'
  const profileRoleLabel = dashboard?.profile?.roleLabel ?? roleLabel
  const MessageIcon = latestMessage ? messageIcons[latestMessage.icon] ?? Bell : Bell
  const dataStatus = isError
    ? 'Customer dashboard data could not load.'
    : isLoading
      ? 'Loading customer dashboard data.'
      : isFetching
        ? 'Refreshing customer dashboard data.'
        : `Dashboard synced ${dashboard?.updatedAt ?? 'now'}.`

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <>
            <button
              className="secondary-action"
              disabled={isFetching}
              onClick={() => refetch()}
              type="button"
            >
              <RefreshCw
                aria-hidden="true"
                className={isFetching ? 'spin-icon' : undefined}
                size={17}
              />
              <span>{isFetching ? 'Syncing' : 'Refresh'}</span>
            </button>
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

      <div className={isError ? 'data-alert danger' : 'data-alert'}>{dataStatus}</div>

      <section className="customer-dashboard-grid">
        <div className="dashboard-panel wide-panel">
          <div className="section-heading">
            <p className="eyebrow">Action Center</p>
            <h2>Next steps</h2>
          </div>

          <div className="customer-action-list">
            {nextActions.length > 0 ? (
              nextActions.map((item) => {
                const Icon = actionIcons[item.icon] ?? UploadCloud

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
                      <button
                        aria-label={`Open ${item.title}`}
                        className="icon-button"
                        type="button"
                      >
                        <ArrowUpRight aria-hidden="true" size={18} />
                      </button>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="data-empty">No customer actions.</div>
            )}
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
            <strong>{profileRoleLabel}</strong>
            <span>Access</span>
            <strong>Customer portal</strong>
            <span>Security</span>
            <strong>Route protected</strong>
          </div>
        </aside>

        <ServiceRequestsPanel auth={auth} mode={USER_ROLES.CUSTOMER} />

        <div className="dashboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Records</p>
            <h2>Customer files</h2>
          </div>

          <div className="record-list">
            {recordItems.length > 0 ? (
              recordItems.map((item) => (
                <article className="record-row" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.meta}</span>
                  </div>
                  <span className={`status-pill ${item.tone}`}>{item.status}</span>
                </article>
              ))
            ) : (
              <div className="data-empty">No customer records.</div>
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Messages</p>
            <h2>Latest update</h2>
          </div>

          {latestMessage ? (
            <article className="message-preview">
              <span className="activity-icon">
                <MessageIcon aria-hidden="true" size={18} />
              </span>
              <div>
                <strong>{latestMessage.title}</strong>
                <p>{latestMessage.body}</p>
              </div>
            </article>
          ) : (
            <div className="data-empty">No customer messages.</div>
          )}
        </div>

        <div className="dashboard-panel full-panel">
          <div className="section-heading">
            <p className="eyebrow">Service</p>
            <h2>Customer support</h2>
          </div>

          <div className="health-grid">
            {supportItems.map((item) => {
              const Icon = supportIcons[item.icon] ?? LifeBuoy

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
