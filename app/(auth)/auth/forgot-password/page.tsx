'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Always show success to prevent email enumeration
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-sm text-gray-700">
            If an account exists with that email, you will receive a reset link.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-6 text-sm text-blue-600 font-medium hover:underline"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Reset Link
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
