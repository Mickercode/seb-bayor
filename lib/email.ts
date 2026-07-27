// Email utility using Resend
// Set RESEND_API_KEY in .env to enable email sending

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'Seb & Bayor <noreply@sebandbayor.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith('re_xxx')) {
    console.log(`[Email] Skipped (no API key): "${subject}" to ${to}`)
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      console.error('[Email] Failed:', data)
      return false
    }

    return true
  } catch (error) {
    console.error('[Email] Error:', error)
    return false
  }
}

// ─── Email Templates ───

export async function sendOrderConfirmation(
  to: string,
  order: { id: string; total: number; itemCount: number }
) {
  const orderRef = order.id.slice(0, 8).toUpperCase()

  return sendEmail({
    to,
    subject: `Order Confirmed — #${orderRef}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d9488; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Seb & Bayor</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #111827; margin-top: 0;">Order Confirmed!</h2>
          <p style="color: #6b7280;">
            Thank you for your order. Here's a summary:
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Order:</strong> #${orderRef}</p>
            <p style="margin: 4px 0;"><strong>Items:</strong> ${order.itemCount}</p>
            <p style="margin: 4px 0;"><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
          </div>
          <p style="color: #6b7280;">
            If your order includes prescription medications, our pharmacist will review your prescription within 2 hours.
          </p>
          <a href="${APP_URL}/dashboard/orders" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">
            View Order
          </a>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af;">
          Seb & Bayor Pharmaceutical Ltd — Patient-centered care
        </div>
      </div>
    `,
  })
}

export async function sendPrescriptionUpdate(
  to: string,
  prescription: { status: string; reviewNote?: string | null }
) {
  const statusLabel =
    prescription.status === 'APPROVED'
      ? 'Approved'
      : prescription.status === 'QUERIED'
      ? 'Queried'
      : prescription.status === 'REJECTED'
      ? 'Rejected'
      : prescription.status

  const statusColor =
    prescription.status === 'APPROVED'
      ? '#059669'
      : prescription.status === 'QUERIED'
      ? '#d97706'
      : '#dc2626'

  return sendEmail({
    to,
    subject: `Prescription ${statusLabel} — Seb & Bayor`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d9488; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Seb & Bayor</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #111827; margin-top: 0;">Prescription Update</h2>
          <p style="color: #6b7280;">Your prescription has been reviewed by our pharmacist.</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;">
              <strong>Status:</strong>
              <span style="color: ${statusColor}; font-weight: 600;"> ${statusLabel}</span>
            </p>
            ${
              prescription.reviewNote
                ? `<p style="margin: 8px 0 4px;"><strong>Pharmacist Note:</strong></p>
                   <p style="margin: 4px 0; color: #374151;">${prescription.reviewNote}</p>`
                : ''
            }
          </div>
          ${
            prescription.status === 'QUERIED'
              ? '<p style="color: #d97706;">Please check your dashboard and respond to the pharmacist query to proceed.</p>'
              : ''
          }
          <a href="${APP_URL}/dashboard/prescriptions" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">
            View Details
          </a>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af;">
          Seb & Bayor Pharmaceutical Ltd — Patient-centered care
        </div>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`

  return sendEmail({
    to,
    subject: 'Reset Your Password — Seb & Bayor',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d9488; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Seb & Bayor</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #111827; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #6b7280;">
            You requested a password reset. Click the button below to set a new password.
            This link expires in 1 hour.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">
            Reset Password
          </a>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af;">
          Seb & Bayor Pharmaceutical Ltd
        </div>
      </div>
    `,
  })
}

export async function sendOrderStatusUpdate(
  to: string,
  order: { id: string; status: string }
) {
  const orderRef = order.id.slice(0, 8).toUpperCase()

  const statusLabel: Record<string, string> = {
    CONFIRMED: 'Confirmed',
    DISPATCHED: 'Dispatched',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  }

  const label = statusLabel[order.status] || order.status

  return sendEmail({
    to,
    subject: `Order #${orderRef} — ${label}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d9488; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Seb & Bayor</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #111827; margin-top: 0;">Order Update</h2>
          <p style="color: #6b7280;">
            Your order <strong>#${orderRef}</strong> has been updated.
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Status:</strong> ${label}</p>
          </div>
          ${
            order.status === 'DISPATCHED'
              ? '<p style="color: #6b7280;">Your order is on its way! You will receive it within the estimated delivery time.</p>'
              : ''
          }
          <a href="${APP_URL}/dashboard/orders" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">
            Track Order
          </a>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af;">
          Seb & Bayor Pharmaceutical Ltd — Patient-centered care
        </div>
      </div>
    `,
  })
}
