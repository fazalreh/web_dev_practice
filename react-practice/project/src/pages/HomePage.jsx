import { useSelector } from 'react-redux'

import { useHealthCheckQuery } from '../app/api/baseApi'
import { selectAuth } from '../features/auth/authSlice'

const stackItems = [
  'React Router',
  'Redux Toolkit',
  'RTK Query',
  'Supabase client',
]

function HomePage() {
  const { data, isLoading } = useHealthCheckQuery()
  const auth = useSelector(selectAuth)
  const supabaseStatus = data?.configured ? 'Ready' : 'Waiting for env'

  return (
    <section className="home-grid">
      <div className="intro-panel">
        <p className="eyebrow">Fazal Sync</p>
        <h1>Frontend foundation</h1>
        <p className="page-copy">
          The app is ready for routing, shared state, server data, and Supabase
          authentication work.
        </p>
      </div>

      <div className="status-panel">
        <div>
          <p className="eyebrow">Current session</p>
          <h2>{auth.status}</h2>
        </div>
        <div className="status-pill">{isLoading ? 'Checking' : supabaseStatus}</div>
      </div>

      <div className="stack-list" aria-label="Core stack">
        {stackItems.map((item) => (
          <div className="stack-item" key={item}>
            <span></span>
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomePage
