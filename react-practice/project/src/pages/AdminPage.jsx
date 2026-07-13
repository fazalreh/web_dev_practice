import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { useGetAdminDashboardQuery } from '../app/api/baseApi'
import AsyncState, { SummarySkeleton } from '../components/feedback/AsyncState'
import PageHeader from '../components/layout/PageHeader'
import SummaryCard from '../components/layout/SummaryCard'
import { selectAuth } from '../features/auth/authSlice'
import ServiceRequestsPanel from '../features/requests/ServiceRequestsPanel'
import { getRoleLabel, ROLE_LABELS, USER_ROLES } from '../lib/roles'

const activityIcons = {
  check: CheckCircle2,
  fileCheck: FileCheck2,
  userCog: UserCog,
}

const healthIcons = {
  activity: Activity,
  clock: Clock3,
  shield: ShieldCheck,
}

function AdminPage() {
  const auth = useSelector(selectAuth)
  const {
    data: dashboard,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAdminDashboardQuery()
  const roleLabel = auth.role ? getRoleLabel(auth.role) : ROLE_LABELS[USER_ROLES.ADMIN]
  const adminStats = dashboard?.stats ?? []
  const reviewQueue = dashboard?.reviewQueue ?? []
  const activityItems = dashboard?.activityItems ?? []
  const healthItems = dashboard?.healthItems ?? []
  const isInitialLoading = isLoading && !dashboard
  const isRefreshing = isFetching && !isInitialLoading
  const dashboardStatus = isError
    ? {
        message: 'The admin dashboard could not load.',
        tone: 'danger',
        title: 'Dashboard error',
      }
    : isInitialLoading
      ? {
          isLoading: true,
          message: 'Fetching metrics, review queue, and controls.',
          title: 'Loading admin dashboard',
        }
      : isRefreshing
        ? {
            isLoading: true,
            message: 'Refreshing the latest admin data.',
            title: 'Syncing dashboard',
          }
        : {
            message: `Last sync ${dashboard?.updatedAt ?? 'now'}.`,
            tone: 'success',
            title: 'Dashboard synced',
          }

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
        {isInitialLoading ? (
          <SummarySkeleton count={3} />
        ) : (
          adminStats.map((stat) => (
            <SummaryCard
              key={stat.label}
              label={stat.label}
              meta={stat.meta}
              tone={stat.tone}
              value={stat.value}
            />
          ))
        )}
      </section>

      <AsyncState
        actionLabel="Retry"
        compact
        isLoading={dashboardStatus.isLoading}
        message={dashboardStatus.message}
        onAction={isError ? () => refetch() : undefined}
        title={dashboardStatus.title}
        tone={dashboardStatus.tone}
      />

      <section className="admin-dashboard-grid">
        <div className="dashboard-panel wide-panel">
          <div className="section-heading">
            <p className="eyebrow">Queue</p>
            <h2>Pending review</h2>
          </div>

          <div className="review-list">
            {isInitialLoading ? (
              <AsyncState
                compact
                isLoading
                message="Fetching approval items."
                title="Loading review queue"
              />
            ) : reviewQueue.length > 0 ? (
              reviewQueue.map((item) => (
                <article className="review-row" key={item.title}>
                  <div className="review-main">
                    <strong>{item.title}</strong>
                    <span>{item.owner}</span>
                  </div>
                  <div className="review-meta">
                    <span
                      className={item.status === 'High' ? 'priority-pill high' : 'priority-pill'}
                    >
                      {item.status}
                    </span>
                    <span>{item.due}</span>
                    <button aria-label={`Open ${item.title}`} className="icon-button" type="button">
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <AsyncState compact message="The queue is clear." title="No pending reviews" />
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Activity</p>
            <h2>Recent changes</h2>
          </div>

          <div className="activity-list">
            {isInitialLoading ? (
              <AsyncState
                compact
                isLoading
                message="Fetching recent changes."
                title="Loading activity"
              />
            ) : activityItems.length > 0 ? (
              activityItems.map((item) => {
                const Icon = activityIcons[item.icon] ?? Activity

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
              })
            ) : (
              <AsyncState compact message="No recent admin changes." title="No activity" />
            )}
          </div>
        </div>

        <ServiceRequestsPanel auth={auth} mode={USER_ROLES.ADMIN} />

        <div className="dashboard-panel full-panel">
          <div className="section-heading">
            <p className="eyebrow">Health</p>
            <h2>Admin controls</h2>
          </div>

          <div className="health-grid">
            {isInitialLoading ? (
              <AsyncState
                compact
                isLoading
                message="Checking admin controls."
                title="Loading controls"
              />
            ) : healthItems.length > 0 ? (
              healthItems.map((item) => {
                const Icon = healthIcons[item.icon] ?? Activity

                return (
                  <article className="health-item" key={item.label}>
                    <Icon aria-hidden="true" size={19} />
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                )
              })
            ) : (
              <AsyncState compact message="No control status available." title="No controls" />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminPage
