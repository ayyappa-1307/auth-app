export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,165,36,0.16),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(232,93,58,0.12),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber">Auth App</p>
          <h1 className="max-w-md font-display text-5xl leading-[1.05] text-white">
            Sign in once. Stay in control of your session.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-sand/70">
            Stateless JWT authentication with BCrypt passwords and a protected profile route.
          </p>
        </section>
        <section className="w-full">
          <div className="rounded-2xl border border-white/10 bg-panel/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <h2 className="font-display text-3xl text-white">{title}</h2>
            <p className="mt-2 text-sm text-sand/65">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </div>
  )
}
