import { AlertTriangle, CheckCircle2, Inbox, LoaderCircle, RefreshCw } from 'lucide-react'

const stateIcons = {
  danger: AlertTriangle,
  empty: Inbox,
  loading: LoaderCircle,
  success: CheckCircle2,
}

function AsyncState({
  actionLabel = 'Retry',
  compact = false,
  isLoading = false,
  message,
  onAction,
  title,
  tone = 'empty',
}) {
  const stateTone = isLoading ? 'loading' : tone
  const Icon = stateIcons[stateTone] ?? Inbox
  const role = stateTone === 'danger' ? 'alert' : 'status'

  return (
    <div
      aria-live={stateTone === 'danger' ? 'assertive' : 'polite'}
      className={`async-state ${stateTone} ${compact ? 'compact' : ''}`}
      role={role}
    >
      <span className="async-state-icon">
        <Icon aria-hidden="true" className={isLoading ? 'spin-icon' : undefined} size={19} />
      </span>
      <div className="async-state-copy">
        <strong>{title}</strong>
        {message && <p>{message}</p>}
      </div>
      {onAction && (
        <button className="secondary-action compact-action" onClick={onAction} type="button">
          <RefreshCw aria-hidden="true" size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

export function SummarySkeleton({ count = 3 }) {
  return Array.from({ length: count }, (_, index) => (
    <article aria-hidden="true" className="summary-card summary-skeleton" key={index}>
      <span className="skeleton-line short"></span>
      <span className="skeleton-line large"></span>
      <span className="skeleton-pill"></span>
    </article>
  ))
}

export default AsyncState
