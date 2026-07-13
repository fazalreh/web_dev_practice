import { Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  useCreateServiceRequestMutation,
  useDeleteServiceRequestMutation,
  useGetServiceRequestsQuery,
  useUpdateServiceRequestMutation,
} from '../../app/api/baseApi'
import AsyncState from '../../components/feedback/AsyncState'
import { USER_ROLES } from '../../lib/roles'

const EMPTY_REQUEST_FORM = {
  title: '',
  category: 'Profile',
  priority: 'normal',
  details: '',
}

const CATEGORY_OPTIONS = ['Profile', 'Billing', 'Support', 'Records']

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In review' },
  { value: 'resolved', label: 'Resolved' },
]

const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map((status) => [status.value, status.label]),
)

const PRIORITY_LABELS = Object.fromEntries(
  PRIORITY_OPTIONS.map((priority) => [priority.value, priority.label]),
)

function getStatusTone(status) {
  if (status === 'resolved') {
    return 'success'
  }

  if (status === 'open') {
    return 'warning'
  }

  return 'neutral'
}

function getMutationMessage(error) {
  return error?.data?.message ?? error?.data ?? error?.message ?? 'Request action failed.'
}

function ServiceRequestsPanel({ auth, mode }) {
  const role = auth.role
  const email = auth.user?.email ?? ''
  const ownerName = auth.user?.user_metadata?.full_name || email.split('@')[0] || 'Customer'
  const isAdminMode = mode === USER_ROLES.ADMIN
  const isCustomerMode = mode === USER_ROLES.CUSTOMER
  const actor = useMemo(
    () => ({
      role,
      email,
      name: ownerName,
    }),
    [email, ownerName, role],
  )
  const { data, isError, isFetching, isLoading, refetch } = useGetServiceRequestsQuery(actor, {
    skip: !role,
  })
  const [createRequest, createState] = useCreateServiceRequestMutation()
  const [updateRequest, updateState] = useUpdateServiceRequestMutation()
  const [deleteRequest, deleteState] = useDeleteServiceRequestMutation()
  const [form, setForm] = useState(EMPTY_REQUEST_FORM)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_REQUEST_FORM)
  const [notice, setNotice] = useState(null)
  const requests = data?.items ?? []
  const isMutating = createState.isLoading || updateState.isLoading || deleteState.isLoading
  const isInitialLoading = isLoading && !data
  const isRefreshing = isFetching && !isInitialLoading
  const mutationStatus = createState.isLoading
    ? 'Creating service request.'
    : updateState.isLoading
      ? 'Saving service request.'
      : deleteState.isLoading
        ? 'Deleting service request.'
        : null
  const panelTitle = isAdminMode ? 'All service requests' : 'My service requests'
  const panelEyebrow = isAdminMode ? 'Admin CRUD' : 'Customer CRUD'

  function updateFormField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function updateEditField(field, value) {
    setEditForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function startEditing(request) {
    setEditId(request.id)
    setEditForm({
      title: request.title,
      category: request.category,
      priority: request.priority,
      details: request.details,
    })
    setNotice(null)
  }

  function cancelEditing() {
    setEditId(null)
    setEditForm(EMPTY_REQUEST_FORM)
  }

  async function handleCreateRequest(event) {
    event.preventDefault()
    setNotice(null)

    try {
      await createRequest({
        actor,
        request: form,
      }).unwrap()
      setForm(EMPTY_REQUEST_FORM)
      setNotice({ tone: 'success', text: 'Service request created.' })
    } catch (error) {
      setNotice({ tone: 'danger', text: getMutationMessage(error) })
    }
  }

  async function handleSaveRequest(request) {
    setNotice(null)

    try {
      await updateRequest({
        actor,
        id: request.id,
        changes: editForm,
      }).unwrap()
      cancelEditing()
      setNotice({ tone: 'success', text: 'Service request updated.' })
    } catch (error) {
      setNotice({ tone: 'danger', text: getMutationMessage(error) })
    }
  }

  async function handleAdminChange(request, field, value) {
    setNotice(null)

    try {
      await updateRequest({
        actor,
        id: request.id,
        changes: {
          [field]: value,
        },
      }).unwrap()
      setNotice({ tone: 'success', text: 'Service request updated.' })
    } catch (error) {
      setNotice({ tone: 'danger', text: getMutationMessage(error) })
    }
  }

  async function handleDeleteRequest(request) {
    setNotice(null)

    try {
      await deleteRequest({
        actor,
        id: request.id,
      }).unwrap()
      setNotice({ tone: 'success', text: 'Service request deleted.' })
    } catch (error) {
      setNotice({ tone: 'danger', text: getMutationMessage(error) })
    }
  }

  function renderEditFields(request) {
    return (
      <div className="request-edit-grid">
        <label className="request-field">
          <span>Title</span>
          <input
            onChange={(event) => updateEditField('title', event.target.value)}
            value={editForm.title}
          />
        </label>
        <label className="request-field">
          <span>Category</span>
          <select
            onChange={(event) => updateEditField('category', event.target.value)}
            value={editForm.category}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="request-field">
          <span>Priority</span>
          <select
            onChange={(event) => updateEditField('priority', event.target.value)}
            value={editForm.priority}
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </label>
        <label className="request-field wide-request-field">
          <span>Details</span>
          <textarea
            onChange={(event) => updateEditField('details', event.target.value)}
            rows={3}
            value={editForm.details}
          />
        </label>
        <div className="request-edit-actions">
          <button
            className="primary-action compact-action"
            disabled={isMutating}
            onClick={() => handleSaveRequest(request)}
            type="button"
          >
            <Save aria-hidden="true" size={16} />
            <span>Save</span>
          </button>
          <button
            className="secondary-action compact-action"
            disabled={isMutating}
            onClick={cancelEditing}
            type="button"
          >
            <X aria-hidden="true" size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    )
  }

  function renderRequest(request) {
    const canCustomerEdit =
      isCustomerMode &&
      role === USER_ROLES.CUSTOMER &&
      request.ownerEmail === email &&
      request.status === 'open'
    const isEditing = editId === request.id

    return (
      <article className="request-row" key={request.id}>
        <div className="request-main">
          <div className="request-title-line">
            <strong>{request.title}</strong>
            <span className={`status-pill ${getStatusTone(request.status)}`}>
              {STATUS_LABELS[request.status] ?? request.status}
            </span>
          </div>

          {isEditing ? (
            renderEditFields(request)
          ) : (
            <>
              <p>{request.details}</p>
              <div className="request-meta">
                {isAdminMode && <span>{request.ownerName}</span>}
                <span>{request.category}</span>
                <span>{PRIORITY_LABELS[request.priority] ?? request.priority} priority</span>
                <span>{request.updatedAt}</span>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="request-controls">
            {isAdminMode && (
              <>
                <label>
                  <span>Status</span>
                  <select
                    disabled={isMutating}
                    onChange={(event) =>
                      handleAdminChange(request, 'status', event.target.value)
                    }
                    value={request.status}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Priority</span>
                  <select
                    disabled={isMutating}
                    onChange={(event) =>
                      handleAdminChange(request, 'priority', event.target.value)
                    }
                    value={request.priority}
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {canCustomerEdit && (
              <button
                aria-label={`Edit ${request.title}`}
                className="icon-button"
                disabled={isMutating}
                onClick={() => startEditing(request)}
                type="button"
              >
                <Edit3 aria-hidden="true" size={17} />
              </button>
            )}

            {(isAdminMode || canCustomerEdit) && (
              <button
                aria-label={`Delete ${request.title}`}
                className="icon-button danger-icon-button"
                disabled={isMutating}
                onClick={() => handleDeleteRequest(request)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={17} />
              </button>
            )}
          </div>
        )}
      </article>
    )
  }

  return (
    <div className="dashboard-panel full-panel request-panel">
      <div className="section-heading">
        <p className="eyebrow">{panelEyebrow}</p>
        <h2>{panelTitle}</h2>
      </div>

      {!role && (
        <AsyncState
          compact
          message="A signed-in role is required before requests can load."
          title="Requests unavailable"
          tone="danger"
        />
      )}

      {notice && <div className={`form-alert ${notice.tone}`}>{notice.text}</div>}

      {mutationStatus && (
        <AsyncState
          compact
          isLoading
          message="Keeping the request list in sync."
          title={mutationStatus}
        />
      )}

      {isRefreshing && (
        <AsyncState
          compact
          isLoading
          message="Fetching the latest request changes."
          title="Refreshing service requests"
        />
      )}

      {isCustomerMode && (
        <form className="request-form" onSubmit={handleCreateRequest}>
          <label className="request-field wide-request-field">
            <span>Title</span>
            <input
              onChange={(event) => updateFormField('title', event.target.value)}
              required
              value={form.title}
            />
          </label>
          <label className="request-field">
            <span>Category</span>
            <select
              onChange={(event) => updateFormField('category', event.target.value)}
              value={form.category}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="request-field">
            <span>Priority</span>
            <select
              onChange={(event) => updateFormField('priority', event.target.value)}
              value={form.priority}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
          <label className="request-field wide-request-field">
            <span>Details</span>
            <textarea
              onChange={(event) => updateFormField('details', event.target.value)}
              required
              rows={3}
              value={form.details}
            />
          </label>
          <button className="primary-action compact-action" disabled={isMutating} type="submit">
            <Plus aria-hidden="true" size={17} />
            <span>Create request</span>
          </button>
        </form>
      )}

      <div className="request-list">
        {isInitialLoading ? (
          <AsyncState
            compact
            isLoading
            message="Fetching service request records."
            title="Loading service requests"
          />
        ) : isError ? (
          <AsyncState
            actionLabel="Retry"
            compact
            message="Service requests could not load."
            onAction={() => refetch()}
            title="Request error"
            tone="danger"
          />
        ) : requests.length > 0 ? (
          requests.map((request) => renderRequest(request))
        ) : (
          <AsyncState
            compact
            message="No service requests are in this workspace."
            title="No service requests"
          />
        )}
      </div>
    </div>
  )
}

export default ServiceRequestsPanel
