import { prisma } from '@/lib/prisma'
import PrescriptionActions from '@/components/admin/prescription-actions'
import { FileText, Clock } from 'lucide-react'

export const metadata = {
  title: 'Prescription Review Queue',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  APPROVED: 'bg-green-100 text-green-700',
  QUERIED: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default async function AdminPrescriptionsPage() {
  const prescriptions = await prisma.prescription.findMany({
    include: {
      user: { select: { fullName: true, email: true, phone: true } },
      order: { select: { id: true, status: true, total: true } },
    },
    orderBy: [
      { status: 'asc' }, // PENDING first (alphabetically before others)
      { submittedAt: 'desc' },
    ],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText size={24} /> Prescription Review Queue
        </h1>
        <span className="text-sm text-gray-500">
          {prescriptions.filter((p) => p.status === 'PENDING').length} pending review
        </span>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No prescriptions submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${
                rx.status === 'PENDING'
                  ? 'border-l-amber-400'
                  : rx.status === 'APPROVED'
                  ? 'border-l-green-400'
                  : rx.status === 'QUERIED'
                  ? 'border-l-amber-400'
                  : 'border-l-red-400'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold">{rx.user.fullName}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        statusColors[rx.status] || statusColors.PENDING
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Email: {rx.user.email}</p>
                    {rx.user.phone && <p>Phone: {rx.user.phone}</p>}
                    {rx.patientName && <p>Patient: {rx.patientName}</p>}
                    {rx.prescriberName && <p>Prescriber: {rx.prescriberName}</p>}
                    {rx.order && (
                      <p>
                        Order: #{rx.order.id.slice(0, 8).toUpperCase()} — ₦
                        {rx.order.total.toLocaleString()}
                      </p>
                    )}
                    <p className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      Submitted: {new Date(rx.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  {rx.fileUrl && (
                    <a
                      href={rx.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-teal-600 hover:underline"
                    >
                      <FileText size={14} /> View Prescription File
                    </a>
                  )}

                  {rx.reviewNote && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                      <span className="font-medium">Review Note:</span> {rx.reviewNote}
                    </div>
                  )}
                </div>

                {rx.status === 'PENDING' && (
                  <PrescriptionActions prescriptionId={rx.id} currentStatus={rx.status} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
