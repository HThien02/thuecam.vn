'use client';

import React, { useState } from 'react';
import { RedirectRule } from '@/types';
import { Plus, Trash2, ArrowRight, CornerDownRight, AlertCircle } from 'lucide-react';
import { deleteAdminRecord, saveAdminRecord } from '@/lib/data/admin-api';

interface Props {
  initialRedirects: RedirectRule[];
}

export default function RedirectManagerClient({ initialRedirects }: Props) {
  const [redirects, setRedirects] = useState<RedirectRule[]>(initialRedirects);
  const [oldUrl, setOldUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [statusCode, setStatusCode] = useState<301 | 302>(301);

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    const source = oldUrl.trim();
    const destination = newUrl.trim();
    const isLocalPath = destination.startsWith('/') && !destination.startsWith('//');
    const isHttpsUrl = /^https:\/\//i.test(destination);
    if (!source.startsWith('/') || source.startsWith('//')) {
      alert('Đường dẫn cũ phải là đường dẫn nội bộ bắt đầu bằng /, ví dụ: /thue-pocket-4');
      return;
    }
    if (!isLocalPath && !isHttpsUrl) {
      alert('Đường dẫn đích phải là đường dẫn nội bộ hoặc URL HTTPS.');
      return;
    }

    try {
      const saved = await saveAdminRecord<RedirectRule>('redirects', {
        old_url: source,
        new_url: destination,
        status_code: statusCode,
        is_active: true,
      });
      setRedirects((current) => [saved, ...current]);
      setOldUrl('');
      setNewUrl('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể tạo chuyển hướng.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa quy tắc chuyển hướng này?')) return;
    try {
      await deleteAdminRecord('redirects', id);
      setRedirects((current) => current.filter((rule) => rule.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể xóa chuyển hướng.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Warning Tip */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Nguyên tắc SEO khi đổi URL Slug:</span>
          <p className="text-slate-300 leading-relaxed">
            Hạn chế đổi slug các trang đã được Google lập chỉ mục (index). Nếu bắt buộc phải đổi, hãy tạo ngay một lệnh chuyển hướng <strong>301 Permanent Redirect</strong> từ URL cũ sang URL mới để không làm mất thứ hạng và tránh lỗi 404 cho người dùng.
          </p>
        </div>
      </div>

      {/* Create New Redirect Form */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          Thêm Quy Tắc Chuyển Hướng 301 Mới
        </h2>

        <form onSubmit={handleAddRedirect} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-5">
            <label className="block text-slate-300 font-semibold mb-1">
              Đường dẫn cũ (Old URL): *
            </label>
            <input
              type="text"
              required
              placeholder="/thue-pocket-4"
              value={oldUrl}
              onChange={(e) => setOldUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-slate-300 font-semibold mb-1">
              Đường dẫn đích mới (New URL): *
            </label>
            <input
              type="text"
              required
              placeholder="/thiet-bi/dji-pocket-4-creator"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Thêm 301</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Redirects Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 px-3">Đường dẫn cũ</th>
              <th className="py-3 px-3 text-center">Chuyển hướng</th>
              <th className="py-3 px-3">Đích đến mới</th>
              <th className="py-3 px-3 text-center">Mã trạng thái</th>
              <th className="py-3 px-3 text-right">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {redirects.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-800/30 font-mono">
                <td className="py-3 px-3 text-rose-300">{rule.old_url}</td>
                <td className="py-3 px-3 text-center">
                  <ArrowRight className="w-4 h-4 text-cyan-400 mx-auto" />
                </td>
                <td className="py-3 px-3 text-emerald-400">{rule.new_url}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                    {rule.status_code}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1 rounded hover:bg-rose-900/40 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
