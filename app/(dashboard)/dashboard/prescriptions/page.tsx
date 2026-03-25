import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, Upload, MessageSquare } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  APPROVED: 'bg-green-100 text-green-700',
  QUERIED: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default async function PrescriptionsPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const prescriptions = await prisma.prescription.findMany({
    where: { userId: session.userId },
    include: {
      order: {
        select: { id: true },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <Link
          href="/prescription/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Prescription
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No prescriptions uploaded yet</p>
          <Link
            href="/prescription/upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Your First Prescription
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[rx.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {rx.status}
                    </span>
                    {rx.order && (
                      <span className="text-sm text-gray-500">
                        Order #{rx.order.id.slice(0, 8).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    Submitted: {formatDate(rx.submittedAt)}
                  </p>

                  {rx.patientName && (
                    <p className="text-sm text-gray-600">
                      Patient: {rx.patientName}
                    </p>
                  )}
                </div>

                {rx.reviewNote && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-sm">
                    <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-700 mb-0.5">
                        Pharmacist Note
                      </p>
                      <p className="text-sm text-amber-800">{rx.reviewNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
