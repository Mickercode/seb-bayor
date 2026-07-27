'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, HelpCircle, X, Send } from 'lucide-react';

interface PrescriptionActionsProps {
  prescriptionId: string;
  currentStatus: string;
}

export default function PrescriptionActions({
  prescriptionId,
  currentStatus,
}: PrescriptionActionsProps) {
  const router = useRouter();
  const [action, setAction] = useState<'APPROVED' | 'QUERIED' | 'REJECTED' | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!action) return;
    if ((action === 'QUERIED' || action === 'REJECTED') && !note.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/prescriptions/${prescriptionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          reviewNote: note.trim() || undefined,
        }),
      });

      if (res.ok) {
        router.refresh();
        setAction(null);
        setNote('');
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'PENDING') {
    return (
      <p className="text-xs text-gray-400 italic">
        Already {currentStatus.toLowerCase()}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {!action ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAction('APPROVED')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => setAction('QUERIED')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Query
          </button>
          <button
            onClick={() => setAction('REJECTED')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                action === 'APPROVED'
                  ? 'text-green-700'
                  : action === 'QUERIED'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {action === 'APPROVED' && 'Approving prescription'}
              {action === 'QUERIED' && 'Query prescription'}
              {action === 'REJECTED' && 'Reject prescription'}
            </span>
          </div>

          {(action === 'QUERIED' || action === 'REJECTED') && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                action === 'QUERIED'
                  ? 'Enter your query for the patient...'
                  : 'Enter reason for rejection...'
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                ((action === 'QUERIED' || action === 'REJECTED') && !note.trim())
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Confirm'}
            </button>
            <button
              onClick={() => {
                setAction(null);
                setNote('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
