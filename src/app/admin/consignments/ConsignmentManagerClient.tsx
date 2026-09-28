'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Phone, Mail, Trash2, UserPlus, Users, Inbox, Save, X, Send } from 'lucide-react';
import {
  APPLICATION_STATUS_LABELS,
  formatDate,
  type ApplicationStatus,
  type ConsignmentApplication,
  type ConsignmentPartner,
  type ConsignmentUnit,
} from '@/lib/consignment';
import {
  CONSIGNMENT_EMAIL_TEMPLATES,
  PARTNER_LOGIN_PATH,
  PLACEHOLDER_PATTERN,
  findTemplate,
  type EmailTemplateContext,
} from '@/lib/consignment-email-templates';

interface EmailTarget {
  email: string;
  name: string;
  deviceName: string;
  applicationId?: string;
  partnerUserId?: string;
}

function partnerLoginUrl() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://thuecam.vn');
  return `${base.replace(/\/$/, '')}${PARTNER_LOGIN_PATH}`;
}

interface Props {
  applications: ConsignmentApplication[];
  partners: ConsignmentPartner[];
  units: ConsignmentUnit[];
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  CONTACTED: 'bg-sky-50 text-sky-800 border-sky-200',
  APPROVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const values = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(values, (value) => chars[value % chars.length]).join('');
}

async function callApi(payload: Record<string, unknown>) {
  const response = await fetch('/api/admin/consignments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? 'Có lỗi xảy ra.');
  return data;
}

export default function ConsignmentManagerClient({ applications, partners, units }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<'applications' | 'partners'>('applications');
  const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [accountFor, setAccountFor] = useState<ConsignmentApplication | 'manual' | null>(null);
  const [editingPartner, setEditingPartner] = useState<ConsignmentPartner | null>(null);
  const [emailTarget, setEmailTarget] = useState<EmailTarget | null>(null);

  const pendingCount = applications.filter((app) => app.status === 'PENDING').length;
  const visibleApplications = useMemo(
    () => (filter === 'ALL' ? applications : applications.filter((app) => app.status === filter)),
    [applications, filter],
  );

  async function run(payload: Record<string, unknown>, success: string) {
    setBusy(true);
    setMessage(null);
    try {
      const result = await callApi(payload);
      setMessage({ type: 'ok', text: success });
      router.refresh();
      return result;
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Có lỗi xảy ra.' });
      return null;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('applications')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${tab === 'applications' ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
        >
          <Inbox className="h-4 w-4" />
          Đơn đăng ký
          {pendingCount > 0 && <span className="rounded-full bg-amber-400 px-2 text-xs text-slate-900">{pendingCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setTab('partners')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${tab === 'partners' ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
        >
          <Users className="h-4 w-4" />
          Tài khoản đối tác ({partners.length})
        </button>
        <button
          type="button"
          onClick={() => setAccountFor('manual')}
          className="ml-auto flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-100"
        >
          <UserPlus className="h-4 w-4" />
          Tạo tài khoản thủ công
        </button>
      </div>

      {message && (
        <p role="status" className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
          {message.text}
        </p>
      )}

      {tab === 'applications' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'PENDING', 'CONTACTED', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${filter === status ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
              >
                {status === 'ALL' ? 'Tất cả' : APPLICATION_STATUS_LABELS[status]}
              </button>
            ))}
          </div>

          {visibleApplications.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Chưa có đơn đăng ký nào.</p>
          ) : (
            <ul className="grid gap-4 xl:grid-cols-2">
              {visibleApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  busy={busy}
                  onSave={(status, adminNote) => run({ action: 'update_application', id: app.id, status, adminNote }, 'Đã cập nhật đơn.')}
                  onDelete={() => {
                    if (confirm(`Xoá đơn ký gửi của ${app.full_name}?`)) run({ action: 'delete_application', id: app.id }, 'Đã xoá đơn.');
                  }}
                  onCreateAccount={() => setAccountFor(app)}
                  onSendEmail={() =>
                    setEmailTarget({
                      email: app.email ?? '',
                      name: app.full_name,
                      deviceName: app.device_name,
                      applicationId: app.id,
                    })
                  }
                />
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section>
          {partners.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Chưa có tài khoản đối tác. Duyệt một đơn đăng ký để cấp tài khoản.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Đối tác</th>
                    <th className="px-4 py-3">Email đăng nhập</th>
                    <th className="px-4 py-3">Chia DT</th>
                    <th className="px-4 py-3">Máy ký gửi</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.map((partner) => {
                    const ownedUnits = units.filter((unit) => unit.owner_partner_id === partner.user_id);
                    return (
                      <tr key={partner.user_id}>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{partner.full_name}</p>
                          <p className="text-xs text-slate-500">{partner.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{partner.email}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{partner.revenue_share_percent}%</td>
                        <td className="px-4 py-3 text-slate-700">
                          {ownedUnits.length === 0 ? <span className="text-slate-400">Chưa gán</span> : ownedUnits.map((unit) => unit.serial_number).join(', ')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${partner.active ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                            {partner.active ? 'Hoạt động' : 'Tạm khoá'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEmailTarget({
                                  email: partner.email,
                                  name: partner.full_name,
                                  deviceName: 'thiết bị ký gửi',
                                  partnerUserId: partner.user_id,
                                })
                              }
                              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Email
                            </button>
                            <button type="button" onClick={() => setEditingPartner(partner)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
                              Sửa & gán máy
                            </button>
                            <button
                              type="button"
                              aria-label={`Xoá tài khoản ${partner.full_name}`}
                              onClick={() => {
                                if (confirm(`Xoá vĩnh viễn tài khoản của ${partner.full_name}? Máy sẽ được gỡ khỏi đối tác.`)) {
                                  run({ action: 'delete_partner', userId: partner.user_id }, 'Đã xoá tài khoản đối tác.');
                                }
                              }}
                              className="rounded-lg border border-rose-200 p-1.5 text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {accountFor && (
        <CreateAccountDialog
          application={accountFor === 'manual' ? null : accountFor}
          busy={busy}
          onClose={() => setAccountFor(null)}
          onSubmit={async (payload) => {
            const result = await run({ action: 'create_partner', ...payload }, `Đã tạo tài khoản. Gửi cho đối tác: ${payload.email} / ${payload.password} — đăng nhập tại /doi-tac/dang-nhap`);
            if (result) {
              setAccountFor(null);
              setTab('partners');
            }
          }}
        />
      )}

      {emailTarget && (
        <SendEmailDialog
          target={emailTarget}
          busy={busy}
          onClose={() => setEmailTarget(null)}
          onSubmit={async (payload) => {
            const result = await run({ action: 'send_email', ...payload }, `Đã gửi email tới ${emailTarget.email}.`);
            if (result) setEmailTarget(null);
          }}
        />
      )}

      {editingPartner && (
        <EditPartnerDialog
          partner={editingPartner}
          units={units}
          busy={busy}
          onClose={() => setEditingPartner(null)}
          onSubmit={async (payload) => {
            const result = await run({ action: 'update_partner', userId: editingPartner.user_id, ...payload }, 'Đã cập nhật đối tác.');
            if (result) setEditingPartner(null);
          }}
        />
      )}
    </div>
  );
}

function ApplicationCard({
  application,
  busy,
  onSave,
  onDelete,
  onCreateAccount,
  onSendEmail,
}: {
  application: ConsignmentApplication;
  busy: boolean;
  onSave: (status: ApplicationStatus, adminNote: string) => void;
  onDelete: () => void;
  onCreateAccount: () => void;
  onSendEmail: () => void;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [adminNote, setAdminNote] = useState(application.admin_note);
  const dirty = status !== application.status || adminNote !== application.admin_note;

  return (
    <li className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-black text-slate-900">{application.full_name}</p>
          <p className="text-xs text-slate-500">Gửi ngày {formatDate(application.created_at)}{application.city ? ` · ${application.city}` : ''}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[application.status]}`}>
          {APPLICATION_STATUS_LABELS[application.status]}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <a href={`tel:${application.phone}`} className="flex items-center gap-1.5 font-semibold text-blue-700 hover:underline">
          <Phone className="h-4 w-4" />
          {application.phone}
        </a>
        {application.email && (
          <a href={`mailto:${application.email}`} className="flex items-center gap-1.5 font-semibold text-blue-700 hover:underline">
            <Mail className="h-4 w-4" />
            {application.email}
          </a>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-slate-50 p-3 text-sm">
        <div className="col-span-2">
          <dt className="text-xs text-slate-500">Thi��t bị</dt>
          <dd className="font-bold text-slate-900">{application.device_name}{application.device_brand ? ` (${application.device_brand})` : ''}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Số lượng</dt>
          <dd className="font-semibold text-slate-800">{application.quantity}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Tình trạng / Năm mua</dt>
          <dd className="font-semibold text-slate-800">{application.device_condition || '—'} / {application.purchase_year ?? '—'}</dd>
        </div>
        {application.note && (
          <div className="col-span-2">
            <dt className="text-xs text-slate-500">Ghi chú của khách</dt>
            <dd className="whitespace-pre-line text-slate-700">{application.note}</dd>
          </div>
        )}
      </dl>

      <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
        <label className="space-y-1 text-xs font-bold text-slate-600">
          Trạng thái
          <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} className={inputClass}>
            {(Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[]).map((key) => (
              <option key={key} value={key}>{APPLICATION_STATUS_LABELS[key]}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs font-bold text-slate-600">
          Ghi chú nội bộ
          <input value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="VD: đã gọi, hẹn qua showroom kiểm máy..." className={inputClass} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={!dirty || busy} onClick={() => onSave(status, adminNote)} className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">
          <Save className="h-3.5 w-3.5" />
          Lưu
        </button>
        <button type="button" disabled={busy} onClick={onSendEmail} className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-40">
          <Send className="h-3.5 w-3.5" />
          Gửi email
        </button>
        {application.partner_user_id ? (
          <span className="text-xs font-bold text-emerald-700">Đã cấp tài khoản</span>
        ) : (
          <button type="button" disabled={busy} onClick={onCreateAccount} className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-40">
            <KeyRound className="h-3.5 w-3.5" />
            Duyệt & cấp tài khoản
          </button>
        )}
        <button type="button" disabled={busy} onClick={onDelete} aria-label="Xoá đơn" className="ml-auto rounded-xl border border-rose-200 p-2 text-rose-700 hover:bg-rose-50 disabled:opacity-40">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CreateAccountDialog({
  application,
  busy,
  onClose,
  onSubmit,
}: {
  application: ConsignmentApplication | null;
  busy: boolean;
  onClose: () => void;
  onSubmit: (payload: { applicationId: string | null; fullName: string; phone: string; email: string; password: string; revenueSharePercent: number }) => void;
}) {
  const [fullName, setFullName] = useState(application?.full_name ?? '');
  const [phone, setPhone] = useState(application?.phone ?? '');
  const [email, setEmail] = useState(application?.email ?? '');
  const [password, setPassword] = useState(generatePassword);
  const [share, setShare] = useState(70);

  return (
    <Dialog title="Cấp tài khoản ký gửi" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ applicationId: application?.id ?? null, fullName, phone, email, password, revenueSharePercent: share });
        }}
      >
        <label className="block space-y-1 text-xs font-bold text-slate-600">
          Tên đối tác
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </label>
        <label className="block space-y-1 text-xs font-bold text-slate-600">
          Số điện thoại
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </label>
        <label className="block space-y-1 text-xs font-bold text-slate-600">
          Email đăng nhập
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="block space-y-1 text-xs font-bold text-slate-600">
          Mật khẩu (gửi cho đối tác)
          <div className="flex gap-2">
            <input required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} font-mono`} />
            <button type="button" onClick={() => setPassword(generatePassword())} className="shrink-0 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100">
              Tạo mới
            </button>
          </div>
        </label>
        <label className="block space-y-1 text-xs font-bold text-slate-600">
          Tỷ lệ doanh thu chia cho đối tác (%)
          <input required type="number" min={0} max={100} step={0.5} value={share} onChange={(e) => setShare(Number(e.target.value))} className={inputClass} />
        </label>
        <p className="text-xs text-slate-500">Sau khi tạo, vào tab Tài khoản đối tác để gán máy (serial) cho đối tác này.</p>
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
          {busy ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>
    </Dialog>
  );
}

function EditPartnerDialog({
  partner,
  units,
  busy,
  onClose,
  onSubmit,
}: {
  partner: ConsignmentPartner;
  units: ConsignmentUnit[];
  busy: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  const [fullName, setFullName] = useState(partner.full_name);
  const [phone, setPhone] = useState(partner.phone);
  const [share, setShare] = useState(Number(partner.revenue_share_percent));
  const [active, setActive] = useState(partner.active);
  const [note, setNote] = useState(partner.note);
  const [newPassword, setNewPassword] = useState('');
  const [unitIds, setUnitIds] = useState<string[]>(units.filter((u) => u.owner_partner_id === partner.user_id).map((u) => u.id));
  const selectableUnits = units.filter((u) => !u.owner_partner_id || u.owner_partner_id === partner.user_id);

  return (
    <Dialog title={`Đối tác: ${partner.full_name}`} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ fullName, phone, revenueSharePercent: share, active, note, newPassword, unitIds });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Tên đối tác
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </label>
          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Số điện thoại
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </label>
          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Chia doanh thu (%)
            <input type="number" min={0} max={100} step={0.5} value={share} onChange={(e) => setShare(Number(e.target.value))} className={inputClass} />
          </label>
          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Đặt lại mật khẩu
            <div className="flex gap-2">
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Để trống nếu giữ nguyên" className={`${inputClass} font-mono`} />
              <button type="button" onClick={() => setNewPassword(generatePassword())} className="shrink-0 rounded-xl border border-slate-200 px-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                Tạo
              </button>
            </div>
          </label>
        </div>
        <label className="block space-y-1 text-xs font-bold text-slate-600">
          Ghi chú
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" />
          Cho phép đăng nhập
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-slate-600">Máy ký gửi (theo serial trong Kho thiết bị)</legend>
          {selectableUnits.length === 0 ? (
            <p className="text-xs text-slate-500">Chưa có máy trống. Thêm serial trong trang Kho thiết bị trước.</p>
          ) : (
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {selectableUnits.map((unit) => (
                <label key={unit.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={unitIds.includes(unit.id)}
                    onChange={(e) => setUnitIds((ids) => (e.target.checked ? [...ids, unit.id] : ids.filter((id) => id !== unit.id)))}
                    className="h-4 w-4"
                  />
                  <span className="font-mono font-semibold text-slate-900">{unit.serial_number}</span>
                  <span className="text-slate-500">{unit.series_name}{unit.label ? ` · ${unit.label}` : ''}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <button type="submit" disabled={busy} className="w-full rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
          {busy ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </Dialog>
  );
}

function SendEmailDialog({
  target,
  busy,
  onClose,
  onSubmit,
}: {
  target: EmailTarget;
  busy: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  const ctx: EmailTemplateContext = useMemo(
    () => ({
      name: target.name,
      deviceName: target.deviceName,
      loginEmail: target.email,
      loginUrl: partnerLoginUrl(),
    }),
    [target],
  );

  const [templateId, setTemplateId] = useState('contacted');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [updateStatus, setUpdateStatus] = useState(true);

  const template = findTemplate(templateId);
  const suggestedStatus = template?.suggestedStatus;

  function applyTemplate(id: string) {
    setTemplateId(id);
    const next = findTemplate(id);
    if (!next) return;
    setSubject(next.subject(ctx));
    setEmailBody(next.body(ctx));
    setUpdateStatus(true);
  }

  useEffect(() => {
    applyTemplate('contacted');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeholdersLeft = emailBody.match(PLACEHOLDER_PATTERN)?.length ?? 0;
  const canSend = !target.email ? false : subject.trim().length >= 3 && emailBody.trim().length >= 10;

  return (
    <Dialog title={`Gửi email cho ${target.name}`} onClose={onClose}>
      {!target.email ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          Đơn này chưa có email nên không thể gửi thông báo. Hãy liên hệ khách qua điện thoại để bổ sung email.
        </p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (placeholdersLeft > 0 && !confirm(`Còn ${placeholdersLeft} chỗ [[...]] chưa điền. Vẫn gửi email?`)) return;
            onSubmit({
              to: target.email,
              subject,
              body: emailBody,
              templateId,
              applicationId: target.applicationId ?? null,
              partnerUserId: target.partnerUserId ?? null,
              updateStatus: target.applicationId && updateStatus && suggestedStatus ? suggestedStatus : '',
            });
          }}
        >
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            Gửi tới <span className="font-bold text-slate-900">{target.email}</span>
          </div>

          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Mẫu email
            <select value={templateId} onChange={(e) => applyTemplate(e.target.value)} className={inputClass}>
              {CONSIGNMENT_EMAIL_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.label}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Tiêu đề
            <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
          </label>

          <label className="block space-y-1 text-xs font-bold text-slate-600">
            Nội dung
            <textarea
              required
              rows={12}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className={`${inputClass} font-mono leading-relaxed`}
            />
          </label>

          {placeholdersLeft > 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              Còn {placeholdersLeft} chỗ cần điền: thay các đoạn trong <code className="font-mono">[[...]]</code> bằng nội dung thật trước khi gửi.
            </p>
          )}

          {target.applicationId && suggestedStatus && (
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={updateStatus} onChange={(e) => setUpdateStatus(e.target.checked)} className="h-4 w-4" />
              Đồng thời cập nhật trạng thái đơn thành “{APPLICATION_STATUS_LABELS[suggestedStatus]}”
            </label>
          )}

          <button
            type="submit"
            disabled={busy || !canSend}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {busy ? 'Đang gửi...' : 'Gửi email'}
          </button>
        </form>
      )}
    </Dialog>
  );
}
