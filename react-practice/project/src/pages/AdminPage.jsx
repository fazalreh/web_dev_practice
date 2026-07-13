import { ROLE_LABELS, USER_ROLES } from '../lib/roles'

function AdminPage() {
  return (
    <section className="page-panel">
      <p className="eyebrow">{ROLE_LABELS[USER_ROLES.ADMIN]}</p>
      <h1>Admin workspace</h1>
      <p className="page-copy">
        Role-based admin tools will land here after authentication is connected.
      </p>
    </section>
  )
}

export default AdminPage
