'use client';

import { FormEvent, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import SafeButton from '@/components/common/SafeButton';
import { isValidEmail } from '@/lib/security/validation';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    // Input validation
    if (!email.trim() || !isValidEmail(email)) {
      setError('Vui lòng nhập định dạng email hợp lệ (ví dụ: admin@gmail.com).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Mật khẩu quản trị phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);

    try {
      // Authenticate via secure server API (sets HttpOnly session cookie, zero localStorage)
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Email hoặc mật khẩu không chính xác.');
        setLoading(false);
        return;
      }

      // Hard redirect to clear any state and load session in layout
      window.location.href = redirectTarget;
    } catch {
      setError('Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white">Đăng Nhập Quản Trị</h1>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email quản trị viên:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>
          </div>

          <SafeButton
            type="submit"
            disabled={loading}
            loadingText="Đang xác thực bảo mật..."
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 py-3.5 font-black text-slate-950 text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>Đăng Nhập Quản Trị</span>
            <ArrowRight className="w-4 h-4" />
          </SafeButton>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14]" />}>
      <LoginFormContent />
    </Suspense>
  );
}
