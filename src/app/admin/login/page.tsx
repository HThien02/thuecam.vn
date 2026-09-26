'use client';

import { FormEvent, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { isValidEmail } from '@/lib/security/validation';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get('from') || '/admin';
  const redirectTarget = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    // Input validation
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Email hoặc mật khẩu không chính xác.');
        setLoading(false);
        return;
      }

      const sessionResponse = await fetch('/api/admin/auth/me', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!sessionResponse.ok) {
        setError('Đăng nhập thành công nhưng phiên chưa được lưu. Vui lòng tải lại trang và thử lại.');
        setLoading(false);
        return;
      }

      window.location.assign(redirectTarget);
    } catch {
      setError('Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  return (
    <main className="admin-shell min-h-screen flex items-center justify-center px-4 py-12 text-slate-900">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white">Đăng Nhập Quản Trị</h1>
          </div>

          {error && (
            <div role="alert" aria-live="assertive" className="flex items-start gap-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Email quản trị viên:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  required
                  type="email"
                  autoComplete="username"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-base text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-base text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>{loading ? 'Đang xác thực bảo mật...' : 'Đăng Nhập Quản Trị'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-shell min-h-screen" />}>
      <LoginFormContent />
    </Suspense>
  );
}
