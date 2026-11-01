import { useAuth } from '../context/AuthContext'

function formatDate(value) {
  if (!value) {
    return '—'
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-ink text-sand">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Auth App</p>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-coral hover:text-coral"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-sand/60">Protected route</p>
        <h1 className="mt-2 font-display text-4xl text-white">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sand/70">
          You are signed in. This page is only reachable with a valid Bearer token.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-panel p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-amber">Profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-sand/50">Full name</dt>
                <dd className="text-lg text-white">{user?.fullName}</dd>
              </div>
              <div>
                <dt className="text-sand/50">Email</dt>
                <dd className="text-white">{user?.email}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-white/10 bg-panel p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-amber">Account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-sand/50">User ID</dt>
                <dd className="text-white">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-sand/50">Created</dt>
                <dd className="text-white">{formatDate(user?.createdAt)}</dd>
              </div>
            </dl>
          </article>
        </section>
      </main>
    </div>
  )
}
