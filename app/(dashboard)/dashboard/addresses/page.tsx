'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NIGERIAN_STATES } from '@/lib/delivery-fees'
import {
  MapPin,
  Plus,
  Trash2,
  Star,
  Loader2,
  X,
} from 'lucide-react'

interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  landmark: string | null
  isDefault: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    landmark: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    try {
      const res = await fetch('/api/addresses')
      if (!res.ok) {
        router.push('/auth/login')
        return
      }
      const data = await res.json()
      setAddresses(data.addresses)
    } catch {
      setError('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ label: 'Home', street: '', city: '', state: '', landmark: '' })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  function startEdit(addr: Address) {
    setForm({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      landmark: addr.landmark || '',
    })
    setEditingId(addr.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.street || !form.city || !form.state) {
      setError('Street, city, and state are required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        resetForm()
        fetchAddresses()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save address')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id))
      }
    } catch {
      setError('Failed to delete address')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })
      if (res.ok) {
        fetchAddresses()
      }
    } catch {
      setError('Failed to update default address')
    }
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Address form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Address' : 'New Address'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <select
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="123 Herbert Macaulay Way"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Ikeja"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closest Landmark</label>
              <input
                type="text"
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                placeholder="Near Computer Village"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update' : 'Save'} Address
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No saved addresses</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-xl border p-5 ${
                addr.isDefault ? 'border-teal-300 bg-teal-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {addr.street}, {addr.city}, {addr.state}
                  </p>
                  {addr.landmark && (
                    <p className="text-sm text-gray-400 mt-0.5">Near {addr.landmark}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(addr)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deletingId === addr.id}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deletingId === addr.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
