import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to create your account. Please try again.'
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) {
      next.fullName = 'Full name is required'
    }
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!form.password) {
      next.password = 'Password is required'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match'
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
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Register with your name, email, and a strong password.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {submitError ? (
          <div className="rounded-lg border border-coral/40 bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
            {submitError}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-sm text-sand/80">Full name</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={onChange}
            className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-white outline-none ring-amber/40 placeholder:text-sand/35 focus:ring-2"
            placeholder="Ayyappa Vavilala"
          />
          {errors.fullName ? <p className="mt-1 text-xs text-coral">{errors.fullName}</p> : null}
        </label>

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
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-white outline-none ring-amber/40 placeholder:text-sand/35 focus:ring-2"
            placeholder="At least 8 characters"
          />
          {errors.password ? <p className="mt-1 text-xs text-coral">{errors.password}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-sand/80">Confirm password</span>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={onChange}
            className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-white outline-none ring-amber/40 placeholder:text-sand/35 focus:ring-2"
            placeholder="Repeat password"
          />
          {errors.confirmPassword ? <p className="mt-1 text-xs text-coral">{errors.confirmPassword}</p> : null}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-sand/65">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-amber hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
