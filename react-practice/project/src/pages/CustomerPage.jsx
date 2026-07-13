import { ROLE_LABELS, USER_ROLES } from '../lib/roles'

function CustomerPage() {
  return (
    <section className="page-panel">
      <p className="eyebrow">{ROLE_LABELS[USER_ROLES.CUSTOMER]}</p>
      <h1>Customer workspace</h1>
      <p className="page-copy">
        Customer account views will land here after authentication is connected.
      </p>
    </section>
  )
}

export default CustomerPage
