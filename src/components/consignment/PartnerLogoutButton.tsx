'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function PartnerLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch('/api/partner/auth/logout', { method: 'POST' }).catch(() => null);
        router.replace('/doi-tac/dang-nhap');
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? 'Đang thoát...' : 'Đăng xuất'}
    </button>
  );
}
