'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, RefreshCw } from 'lucide-react';

type Row = Record<string, any>;
type Props = { initialSeries: Row[]; initialUnits: Row[]; initialAssignments: Row[]; products: Row[]; bookings: Row[] };

async function saveRecord(table: string, record: Row, operation: 'create' | 'update' = 'create') {
  const response = await fetch('/api/admin/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, record, operation }) });
  if (!response.ok) throw new Error('Không thể lưu dữ liệu.');
  return response.json();
}

async function deleteRecord(table: string, id: string) {
  const response = await fetch(`/api/admin/data?table=${table}&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Không thể xoá dữ liệu.');
}

export default function InventoryManagerClient({ initialSeries, initialUnits, initialAssignments, products, bookings }: Props) {
  const [series, setSeries] = useState(initialSeries);
  const [units, setUnits] = useState(initialUnits);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [message, setMessage] = useState('');
  const [seriesDraft, setSeriesDraft] = useState({ name: '', slug: '', product_id: '', description: '', active: true });
  const [unitDraft, setUnitDraft] = useState({ series_id: '', serial_number: '', label: '', status: 'AVAILABLE', note: '' });
  const [assignmentDraft, setAssignmentDraft] = useState({ booking_id: '', unit_id: '' });

  const refresh = () => window.location.reload();
  const run = async (action: () => Promise<void>) => { try { setMessage('Đang lưu...'); await action(); setMessage('Đã lưu.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra.'); } };
  const addSeries = () => run(async () => { const saved = await saveRecord('camera_series', { ...seriesDraft, id: crypto.randomUUID() }); setSeries((rows) => [...rows, saved]); setSeriesDraft({ name: '', slug: '', product_id: '', description: '', active: true }); });
  const addUnit = () => run(async () => { const saved = await saveRecord('camera_units', { ...unitDraft, id: crypto.randomUUID() }); setUnits((rows) => [...rows, saved]); setUnitDraft({ series_id: '', serial_number: '', label: '', status: 'AVAILABLE', note: '' }); });
  const saveAssignment = () => run(async () => { const saved = await saveRecord('booking_camera_assignments', { ...assignmentDraft, id: crypto.randomUUID(), assigned_by: 'ADMIN' }); setAssignments((rows) => [...rows.filter((row) => row.booking_id !== assignmentDraft.booking_id), saved]); });
  const removeUnit = (id: string) => run(async () => { await deleteRecord('camera_units', id); setUnits((rows) => rows.filter((row) => row.id !== id)); });

  return <main className="mx-auto max-w-7xl space-y-6 p-6 text-slate-100">
    <header><p className="text-xs font-black uppercase tracking-widest text-sky-400">THUECAM INVENTORY CONTROL</p><h1 className="mt-2 text-3xl font-black text-white">Kho camera & phân bổ máy</h1><p className="mt-2 text-sm text-slate-400">Quản lý số lượng theo series, serial từng máy và gán máy cụ thể cho từng đơn.</p></header>
    {message && <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">{message}</div>}
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"><h2 className="text-lg font-black">Series máy</h2><div className="mt-4 grid gap-2 sm:grid-cols-2"><input placeholder="Tên series" value={seriesDraft.name} onChange={(e) => setSeriesDraft({ ...seriesDraft, name: e.target.value })} className="field" /><input placeholder="Slug" value={seriesDraft.slug} onChange={(e) => setSeriesDraft({ ...seriesDraft, slug: e.target.value })} className="field" /><select value={seriesDraft.product_id} onChange={(e) => setSeriesDraft({ ...seriesDraft, product_id: e.target.value })} className="field sm:col-span-2"><option value="">Chọn sản phẩm liên kết</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><input placeholder="Mô tả" value={seriesDraft.description} onChange={(e) => setSeriesDraft({ ...seriesDraft, description: e.target.value })} className="field sm:col-span-2" /><button onClick={addSeries} className="action"><Plus className="size-4" /> Thêm series</button></div><div className="mt-5 space-y-2">{series.map((item) => <div key={item.id} className="rounded-xl border border-slate-800 p-3"><div className="flex justify-between gap-3"><div><p className="font-bold">{item.name}</p><p className="text-xs text-slate-500">{item.slug} · {item.active ? 'Đang dùng' : 'Tắt'}</p></div><span className="text-xs text-sky-300">{units.filter((unit) => unit.series_id === item.id).length} máy</span></div></div>)}</div></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"><h2 className="text-lg font-black">Thêm camera vào kho</h2><div className="mt-4 grid gap-2"><select value={unitDraft.series_id} onChange={(e) => setUnitDraft({ ...unitDraft, series_id: e.target.value })} className="field"><option value="">Chọn series</option>{series.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input placeholder="Serial number" value={unitDraft.serial_number} onChange={(e) => setUnitDraft({ ...unitDraft, serial_number: e.target.value })} className="field" /><input placeholder="Tên hiển thị" value={unitDraft.label} onChange={(e) => setUnitDraft({ ...unitDraft, label: e.target.value })} className="field" /><select value={unitDraft.status} onChange={(e) => setUnitDraft({ ...unitDraft, status: e.target.value })} className="field"><option value="AVAILABLE">Sẵn sàng</option><option value="MAINTENANCE">Bảo trì</option><option value="RETIRED">Ngừng sử dụng</option></select><button onClick={addUnit} className="action"><Plus className="size-4" /> Thêm máy</button></div><div className="mt-5 space-y-2">{units.map((unit) => <div key={unit.id} className="flex items-center justify-between rounded-xl border border-slate-800 p-3"><div><p className="font-bold">{unit.label || unit.serial_number}</p><p className="text-xs text-slate-500">{unit.serial_number} · {series.find((item) => item.id === unit.series_id)?.name || 'Chưa có series'}</p></div><button onClick={() => removeUnit(unit.id)} className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10"><Trash2 className="size-4" /></button></div>)}</div></div>
    </section>
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black">Gán máy cho đơn</h2><p className="text-xs text-slate-500">Database tự gán máy khi đơn mới được tạo; admin có thể ghi đè tại đây.</p></div><button onClick={refresh} className="action secondary"><RefreshCw className="size-4" /> Làm mới</button></div><div className="mt-4 grid gap-2 md:grid-cols-3"><select value={assignmentDraft.booking_id} onChange={(e) => setAssignmentDraft({ ...assignmentDraft, booking_id: e.target.value })} className="field"><option value="">Chọn đơn</option>{bookings.filter((booking) => booking.status !== 'CANCELLED').map((booking) => <option key={booking.id} value={booking.id}>{booking.booking_code} · {booking.product_name}</option>)}</select><select value={assignmentDraft.unit_id} onChange={(e) => setAssignmentDraft({ ...assignmentDraft, unit_id: e.target.value })} className="field"><option value="">Chọn máy</option>{units.filter((unit) => unit.status === 'AVAILABLE').map((unit) => <option key={unit.id} value={unit.id}>{unit.label || unit.serial_number}</option>)}</select><button onClick={saveAssignment} className="action"><Save className="size-4" /> Lưu gán máy</button></div><div className="mt-5 divide-y divide-slate-800">{assignments.map((assignment) => <div key={assignment.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span>{bookings.find((booking) => booking.id === assignment.booking_id)?.booking_code || assignment.booking_id}</span><span className="text-sky-300">{units.find((unit) => unit.id === assignment.unit_id)?.serial_number || assignment.unit_id}</span><span className="text-xs text-slate-500">{assignment.assigned_by}</span></div>)}</div></section>
    <style jsx>{`.field{border:1px solid rgb(51 65 85);border-radius:.75rem;background:rgb(2 6 23);padding:.65rem .75rem;font-size:.8rem;color:white;outline:none}.action{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border-radius:.75rem;background:rgb(14 165 233 / .18);padding:.65rem .85rem;font-size:.75rem;font-weight:800;color:rgb(125 211 252)}.action.secondary{background:rgb(51 65 85 / .35);color:rgb(203 213 225)}`}</style>
  </main>;
}
