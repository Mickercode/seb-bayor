'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, LogOut, Pencil, Save, X } from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setFullName(data.user.fullName || '');
        setEmail(data.user.email || '');
        setPhone(data.user.phone || '');
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch {
      setLoggingOut(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            ) : (
              <p className="text-gray-900">{user.fullName}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
              <Mail className="w-4 h-4" />
              Email
            </label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            ) : (
              <p className="text-gray-900">{user.phone || 'Not provided'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm"
              title="Save functionality coming in Phase 2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
