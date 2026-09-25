import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
        <Loader2 className="size-5 animate-spin text-sky-600" aria-hidden="true" />
        <span>Đang tải nội dung…</span>
      </div>
    </div>
  );
}
