'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { NIGERIAN_STATES, getDeliveryFee, getDeliveryEstimate } from '@/lib/delivery-fees'
import {
  MapPin,
  FileText,
  CreditCard,
  ChevronRight,
  Upload,
  AlertTriangle,
  CheckCircle,
  Truck,
} from 'lucide-react'

type Step = 'delivery' | 'prescription' | 'payment'

interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  landmark: string | null
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart: items, getCartTotal, hasRxItems, clearCart } = useCart()
  const [step, setStep] = useState<Step>('delivery')
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [deliveryEstimate, setDeliveryEstimate] = useState('')
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriberName, setPrescriberName] = useState('')
  const [prescriptionNotes, setPrescriptionNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  // New address form
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    landmark: '',
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
      return
    }
    fetchAddresses()
  }, [items.length, router])

  async function fetchAddresses() {
    try {
      const res = await fetch('/api/addresses')
      if (res.ok) {
        const data = await res.json()
        setSavedAddresses(data.addresses)
        const defaultAddr = data.addresses.find((a: Address) => a.isDefault)
        if (defaultAddr) {
          selectAddress(defaultAddr)
        }
      }
    } catch {
      // Not logged in or error — show new address form
      setShowNewAddress(true)
    }
  }

  function selectAddress(address: Address) {
    setSelectedAddressId(address.id)
    setDeliveryFee(getDeliveryFee(address.state))
    setDeliveryEstimate(getDeliveryEstimate(address.state))
  }

  async function handleSaveNewAddress() {
    if (!newAddress.street || !newAddress.city || !newAddress.state) {
      setError('Please fill in street, city, and state')
      return
    }

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAddress, isDefault: true }),
      })

      if (res.ok) {
        const data = await res.json()
        setSavedAddresses([...savedAddresses, data.address])
        selectAddress(data.address)
        setShowNewAddress(false)
        setError('')
      }
    } catch {
      setError('Failed to save address')
    }
  }

  function handleDeliveryContinue() {
    if (!selectedAddressId && !newAddress.state) {
      setError('Please select or add a delivery address')
      return
    }

    if (!selectedAddressId && newAddress.state) {
      handleSaveNewAddress().then(() => {
        if (hasRxItems()) {
          setStep('prescription')
        } else {
          setStep('payment')
        }
      })
      return
    }

    setError('')
    if (hasRxItems()) {
      setStep('prescription')
    } else {
      setStep('payment')
    }
  }

  function handlePrescriptionContinue() {
    if (hasRxItems() && !prescriptionFile) {
      setError('Please upload your prescription')
      return
    }
    setError('')
    setStep('payment')
  }

  async function handlePlaceOrder() {
    if (!disclaimerAccepted) {
      setError('Please accept the medical disclaimer to proceed')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          addressId: selectedAddressId,
          notes: prescriptionNotes || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create order')
      }

      const data = await res.json()
      clearCart()
      router.push(`/orders/${data.order.id}/confirmation`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = getCartTotal()
  const total = subtotal + deliveryFee

  return (
    <div className="section-padding bg-gray-50 min-h-screen" data-zone="shop">
      <div className="container-max">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <StepIndicator
            label="Delivery"
            icon={<MapPin size={16} />}
            active={step === 'delivery'}
            completed={step === 'prescription' || step === 'payment'}
            onClick={() => setStep('delivery')}
          />
          <ChevronRight size={16} className="text-gray-400" />
          {hasRxItems() && (
            <>
              <StepIndicator
                label="Prescription"
                icon={<FileText size={16} />}
                active={step === 'prescription'}
                completed={step === 'payment'}
                onClick={() => step === 'payment' && setStep('prescription')}
              />
              <ChevronRight size={16} className="text-gray-400" />
            </>
          )}
          <StepIndicator
            label="Payment"
            icon={<CreditCard size={16} />}
            active={step === 'payment'}
            completed={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {/* Delivery step */}
            {step === 'delivery' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin size={20} /> Delivery Address
                </h2>

                {savedAddresses.length > 0 && !showNewAddress && (
                  <div className="space-y-3 mb-4">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? 'border-mint-500 bg-mint-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => selectAddress(addr)}
                          className="sr-only"
                        />
                        <span className="font-semibold text-sm">{addr.label}</span>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.street}, {addr.city}, {addr.state}
                          {addr.landmark && ` (Near ${addr.landmark})`}
                        </p>
                      </label>
                    ))}
                    <button
                      onClick={() => setShowNewAddress(true)}
                      className="text-sm text-mint-600 font-medium hover:underline"
                    >
                      + Add new address
                    </button>
                  </div>
                )}

                {(showNewAddress || savedAddresses.length === 0) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <select
                        value={newAddress.label}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, label: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option>Home</option>
                        <option>Office</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        placeholder="123 Herbert Macaulay Way"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          placeholder="Ikeja"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <select
                          value={newAddress.state}
                          onChange={(e) => {
                            const state = e.target.value
                            setNewAddress({ ...newAddress, state })
                            setDeliveryFee(getDeliveryFee(state))
                            setDeliveryEstimate(getDeliveryEstimate(state))
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">Select state</option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closest Landmark
                      </label>
                      <input
                        type="text"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, landmark: e.target.value })
                        }
                        placeholder="Near Computer Village"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}

                {deliveryEstimate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm text-blue-700">
                    <Truck size={16} />
                    Estimated delivery: {deliveryEstimate}
                  </div>
                )}

                <button
                  onClick={handleDeliveryContinue}
                  className="btn-accent w-full mt-6 py-3"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Prescription step */}
            {step === 'prescription' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText size={20} /> Upload Prescription
                </h2>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 text-sm">
                  <p className="font-semibold">One or more items require a valid prescription.</p>
                  <p className="mt-1">
                    Your prescription will be reviewed by our pharmacist before your order
                    is confirmed (within 2 hours).
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your prescription (JPG, PNG, or PDF — max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  {prescriptionFile && (
                    <p className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                      <CheckCircle size={14} /> {prescriptionFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prescriber / Doctor Name
                    </label>
                    <input
                      type="text"
                      value={prescriberName}
                      onChange={(e) => setPrescriberName(e.target.value)}
                      placeholder="Dr. Adebayo"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes to Pharmacist
                    </label>
                    <textarea
                      value={prescriptionNotes}
                      onChange={(e) => setPrescriptionNotes(e.target.value)}
                      placeholder="Any additional information..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePrescriptionContinue}
                  className="btn-accent w-full mt-6 py-3"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment step */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={20} /> Payment
                </h2>

                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm py-1">
                      <span>
                        {item.nameGeneric} x{item.quantity}
                      </span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t mt-3 pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span>₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center text-sm text-gray-600">
                  <p className="font-semibold mb-2">Paystack Payment</p>
                  <p>
                    Payment integration will be activated when Paystack keys are configured.
                    For now, orders are placed with &quot;Pending&quot; payment status.
                  </p>
                </div>

                <label className="flex items-start gap-2 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-gray-600">
                    I understand that this platform does not replace professional medical
                    diagnosis or treatment. I have read and agree to the{' '}
                    <Link href="/legal/terms" className="text-mint-600 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" className="text-mint-600 underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !disclaimerAccepted}
                  className="btn-accent w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Order...' : `Place Order — ₦${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.nameGeneric}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span>{deliveryFee ? `₦${deliveryFee.toLocaleString()}` : '—'}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepIndicator({
  label,
  icon,
  active,
  completed,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  completed: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-mint-500 text-black'
          : completed
          ? 'bg-mint-100 text-mint-700 cursor-pointer'
          : 'bg-gray-100 text-gray-400 cursor-default'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
