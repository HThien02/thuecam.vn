'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Clock3, Plus, Save, Tag, Trash2, X } from 'lucide-react';
import SafeButton from '@/components/common/SafeButton';

type Voucher = {
  id: string;
  code: string;
  discount_type: 'PERCENT' | 'FIXED';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
};

type VoucherForm = {
  code: string;
  discount_type: Voucher['discount_type'];
  discount_value: string;
  max_uses: string;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
};

const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500';

function toLocalInput(value: string | Date) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function blankForm(): VoucherForm {
  return {
    code: '',
    discount_type: 'PERCENT',
    discount_value: '10',
    max_uses: '',
    starts_at: toLocalInput(new Date()),
    expires_at: '',
    is_active: true,
  };
}

export default function VoucherManagerClient({ initialVouchers }: { initialVouchers: Voucher[] }) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [form, setForm] = useState<VoucherForm>(blankForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');

  const startCreate = () => {
    setEditingId(null);
    setForm(blankForm());
    setErrorMessage('');
    setNotice('');
    setIsFormOpen(true);
  };

  const startEdit = (voucher: Voucher) => {
    setEditingId(voucher.id);
    setForm({
      code: voucher.code,
      discount_type: voucher.discount_type,
      discount_value: String(voucher.discount_value),
      max_uses: voucher.max_uses === null ? '' : String(voucher.max_uses),
      starts_at: toLocalInput(voucher.starts_at),
      expires_at: voucher.expires_at ? toLocalInput(voucher.expires_at) : '',
      is_active: voucher.is_active,
    });
    setErrorMessage('');
    setNotice('');
    setIsFormOpen(true);
  };

  const saveVoucher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          ...form,
          discount_value: Number(form.discount_value),
          max_uses: form.max_uses ? Number(form.max_uses) : null,
          starts_at: new Date(form.starts_at).toISOString(),
          expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Không thể lưu voucher.');
      setVouchers((current) => [result, ...current.filter((voucher) => voucher.id !== result.id)]);
      setIsFormOpen(false);
      setNotice(editingId ? 'Đã cập nhật voucher.' : 'Đã tạo voucher mới.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể lưu voucher.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (voucher: Voucher) => {
    setErrorMessage('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          id: voucher.id,
          code: voucher.code,
          discount_type: voucher.discount_type,
          discount_value: voucher.discount_value,
          max_uses: voucher.max_uses,
          starts_at: voucher.starts_at,
          expires_at: voucher.expires_at,
          is_active: !voucher.is_active,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Không thể cập nhật trạng thái.');
      setVouchers((current) => current.map((item) => item.id === voucher.id ? result : item));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.');
    }
  };

  const deleteVoucher = async (voucher: Voucher) => {
    if (voucher.used_count > 0 || !window.confirm(`Xóa voucher ${voucher.code}?`)) return;
    setErrorMessage('');
    try {
      const response = await fetch(`/api/admin/vouchers?id=${encodeURIComponent(voucher.id)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const result = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(result?.error ?? 'Không thể xóa voucher.');
      setVouchers((current) => current.filter((item) => item.id !== voucher.id));
      setNotice(`Đã xóa voucher ${voucher.code}.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể xóa voucher.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400">Thiết lập mã giảm giá, thời hạn và giới hạn sử dụng. Hệ thống khóa lượt dùng an toàn khi khách đặt đơn.</div>
        <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-sky-400">
          <Plus className="size-4" /> Tạo voucher
        </button>
      </div>

      {(errorMessage || notice) && <p role={errorMessage ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-xs font-bold ${errorMessage ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>{errorMessage || notice}</p>}

      {vouchers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center text-sm text-slate-400">Chưa có voucher nào. Tạo mã đầu tiên để khách có thể áp dụng khi đặt thuê.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-slate-950/70 text-[10px] uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Mã voucher</th><th className="px-4 py-3">Ưu đãi</th><th className="px-4 py-3">Đã dùng / giới hạn</th><th className="px-4 py-3">Thời hạn</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="text-slate-600">
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-mono font-black text-white"><Tag className="size-3.5 text-sky-400" />{voucher.code}</span></td>
                  <td className="px-4 py-4 font-bold text-sky-300">{voucher.discount_type === 'PERCENT' ? `${voucher.discount_value}%` : `${voucher.discount_value.toLocaleString('vi-VN')} ₫`}</td>
                  <td className="px-4 py-4">{voucher.used_count} / {voucher.max_uses ?? '∞'}</td>
                  <td className="px-4 py-4 text-slate-400"><span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{new Date(voucher.starts_at).toLocaleDateString('vi-VN')} – {voucher.expires_at ? new Date(voucher.expires_at).toLocaleDateString('vi-VN') : 'Không giới hạn'}</span></td>
                  <td className="px-4 py-4"><button type="button" onClick={() => toggleActive(voucher)} className={`rounded-full px-2.5 py-1 text-[10px] font-black ${voucher.is_active ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>{voucher.is_active ? 'Đang bật' : 'Đã tắt'}</button></td>
                  <td className="px-4 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => startEdit(voucher)} className="rounded-lg border border-slate-700 px-2.5 py-1.5 font-bold text-slate-600 hover:border-sky-500 hover:text-sky-300">Sửa</button><button type="button" disabled={voucher.used_count > 0} onClick={() => deleteVoucher(voucher)} aria-label={`Xóa voucher ${voucher.code}`} className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:border-rose-500 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="size-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form onSubmit={saveVoucher} className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl sm:p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-black">{editingId ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}</h2><button type="button" onClick={() => setIsFormOpen(false)} aria-label="Đóng" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="size-4" /></button></div>
            <div><label htmlFor="voucher-code" className="mb-1.5 block text-xs font-bold text-slate-600">Mã voucher</label><input id="voucher-code" required maxLength={32} value={form.code} onChange={(e) => setForm((current) => ({ ...current, code: e.target.value.toUpperCase() }))} placeholder="VD: THUECAM10" className={`${inputClass} font-mono font-black uppercase`} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="voucher-type" className="mb-1.5 block text-xs font-bold text-slate-600">Loại ưu đãi</label><select id="voucher-type" value={form.discount_type} onChange={(e) => setForm((current) => ({ ...current, discount_type: e.target.value as VoucherForm['discount_type'] }))} className={inputClass}><option value="PERCENT">Phần trăm (%)</option><option value="FIXED">Số tiền (VNĐ)</option></select></div>
              <div><label htmlFor="voucher-value" className="mb-1.5 block text-xs font-bold text-slate-600">Giá trị giảm</label><input id="voucher-value" type="number" min="1" max={form.discount_type === 'PERCENT' ? 100 : 100000000} required value={form.discount_value} onChange={(e) => setForm((current) => ({ ...current, discount_value: e.target.value }))} className={inputClass} /></div>
            </div>
            <div><label htmlFor="voucher-limit" className="mb-1.5 block text-xs font-bold text-slate-600">Giới hạn lượt dùng <span className="font-normal text-slate-500">(để trống là không giới hạn)</span></label><input id="voucher-limit" type="number" min="1" max="1000000" value={form.max_uses} onChange={(e) => setForm((current) => ({ ...current, max_uses: e.target.value }))} className={inputClass} /></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div><label htmlFor="voucher-start" className="mb-1.5 block text-xs font-bold text-slate-600">Bắt đầu từ</label><input id="voucher-start" type="datetime-local" required value={form.starts_at} onChange={(e) => setForm((current) => ({ ...current, starts_at: e.target.value }))} className={inputClass} /></div>
              <div><label htmlFor="voucher-end" className="mb-1.5 block text-xs font-bold text-slate-600">Hết hạn <span className="font-normal text-slate-500">(tùy chọn)</span></label><input id="voucher-end" type="datetime-local" value={form.expires_at} onChange={(e) => setForm((current) => ({ ...current, expires_at: e.target.value }))} className={inputClass} /></div>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm((current) => ({ ...current, is_active: e.target.checked }))} className="size-4 accent-sky-500" />Cho phép sử dụng</label>
            {errorMessage && <p role="alert" className="text-xs font-bold text-rose-300">{errorMessage}</p>}
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-600">Hủy</button><SafeButton type="submit" disabled={isSaving} loadingText="Đang lưu..." className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-sky-400"><Save className="size-4" />Lưu voucher</SafeButton></div>
          </form>
        </div>
      )}
    </div>
  );
}
