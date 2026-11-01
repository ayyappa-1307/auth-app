import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to sign in. Check your credentials and try again.'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!form.password) {
      next.password = 'Password is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError('')
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await login({ email: form.email.trim(), password: form.password })
      const dest = location.state?.from && location.state.from !== '/login' ? location.state.from : '/dashboard'
      navigate(dest, { replace: true })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in with your email and password.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {submitError ? (
          <div className="rounded-lg border border-coral/40 bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
            {submitError}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm text-sand/80">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-white outline-none ring-amber/40 placeholder:text-sand/35 focus:ring-2"
            placeholder="you@example.com"
          />
          {errors.email ? <p className="mt-1 text-xs text-coral">{errors.email}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-sand/80">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-white outline-none ring-amber/40 placeholder:text-sand/35 focus:ring-2"
            placeholder="Your password"
          />
          {errors.password ? <p className="mt-1 text-xs text-coral">{errors.password}</p> : null}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-sand/65">
        Need an account?{' '}
        <Link to="/register" className="font-medium text-amber hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
