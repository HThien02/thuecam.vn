'use client';

import React, { useState } from 'react';
import { Review, Product } from '@/types';
import { Star, CheckCircle2, XCircle, ShieldCheck, Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { deleteAdminRecord, saveAdminRecord } from '@/lib/data/admin-api';

interface Props {
  initialReviews: Review[];
  products: Product[];
}

export default function ReviewModerationClient({
  initialReviews,
  products,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (id: string, status: Review['status']) => {
    try {
      await saveAdminRecord('reviews', { id, status }, 'update');
      setReviews((current) => current.map((review) => review.id === id ? { ...review, status } : review));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể cập nhật đánh giá.');
    }
  };

  const handleApprove = (id: string) => handleStatusChange(id, 'APPROVED');
  const handleReject = (id: string) => handleStatusChange(id, 'REJECTED');

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await deleteAdminRecord('reviews', id);
      setReviews((current) => current.filter((review) => review.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể xóa đánh giá.');
    }
  };

  const [formOpen, setFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    product_id: '',
    user_name: '',
    rating: 5,
    comment: '',
    rental_verified: true,
    status: 'APPROVED' as Review['status'],
  });

  const openForm = (review: Review | null) => {
    setEditingReview(review);
    setForm({
      product_id: review?.product_id ?? products[0]?.id ?? '',
      user_name: review?.user_name ?? '',
      rating: review?.rating ?? 5,
      comment: review?.comment ?? '',
      rental_verified: review?.rental_verified ?? true,
      status: review?.status ?? 'APPROVED',
    });
    setFormOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const rating = Math.min(5, Math.max(1, Math.round(Number(form.rating))));
    const record = {
      id: editingReview?.id ?? crypto.randomUUID(),
      product_id: form.product_id || null,
      user_name: form.user_name.trim(),
      rating,
      comment: form.comment.trim(),
      rental_verified: form.rental_verified,
      status: form.status,
    };
    if (!record.user_name || !record.comment) return;
    setSaving(true);
    try {
      const saved = await saveAdminRecord<Review>('reviews', record, editingReview ? 'update' : 'create');
      setReviews((current) =>
        editingReview ? current.map((review) => (review.id === saved.id ? saved : review)) : [saved, ...current],
      );
      setFormOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể lưu đánh giá.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400';

  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;
  const avgRating =
    approvedCount > 0
      ? (
          reviews
            .filter((r) => r.status === 'APPROVED')
            .reduce((sum, r) => sum + r.rating, 0) / approvedCount
        ).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Metrics Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-2xl">
            {avgRating}★
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Điểm Đánh Giá Thật Trung Bình
            </span>
            <span className="text-sm font-bold text-white">
              Tính từ {approvedCount} lượt đánh giá hợp lệ đã qua phê duyệt
            </span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-600 hover:text-white'
            }`}
          >
            Tất cả ({reviews.length})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-600 hover:text-white'
            }`}
          >
            Đã Duyệt ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'PENDING'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-600 hover:text-white'
            }`}
          >
            Chờ Duyệt ({reviews.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'REJECTED'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-600 hover:text-white'
            }`}
          >
            Từ Chối ({reviews.filter((r) => r.status === 'REJECTED').length})
          </button>
          <button
            onClick={() => openForm(null)}
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 font-black text-slate-950"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm đánh giá
          </button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const product = products.find((p) => p.id === rev.product_id);

          return (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white text-sm">{rev.user_name}</span>
                  {rev.rental_verified && (
                    <span className="badge-verified">
                      <ShieldCheck className="w-3 h-3" />
                      Khách Thuê Đã Xác Minh
                    </span>
                  )}
                  {product && (
                    <span className="text-slate-400">
                      • Thuê máy: <strong className="text-cyan-400">{product.name}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rev.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : rev.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {rev.status}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {rev.created_at.split('T')[0]}
                  </span>
                </div>
              </div>

              {/* Stars & Comment */}
              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

              {/* Moderation Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/60">
                {rev.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Duyệt Hiển Thị</span>
                  </button>
                )}
                {rev.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleReject(rev.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-600 flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Từ Chối</span>
                  </button>
                )}
                <button
                  onClick={() => openForm(rev)}
                  className="p-1.5 rounded-lg text-sky-400 transition-colors"
                  title="Sửa đánh giá"
                  aria-label="Sửa đánh giá"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-950/50 text-rose-400 transition-colors"
                  title="Xóa đánh giá"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredReviews.length === 0 && (
          <p className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
            Không có đánh giá nào trong mục này.
          </p>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
          <form onSubmit={handleSave} className="my-8 w-full max-w-lg space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">{editingReview ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h2>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Đóng">
                <X className="text-slate-400" />
              </button>
            </div>

            <label className="block space-y-1.5 font-bold text-slate-300">
              <span>Thiết bị được đánh giá</span>
              <select
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                className={inputClass}
              >
                <option value="">Không gắn thiết bị</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5 font-bold text-slate-300">
              <span>Tên khách hàng *</span>
              <input required value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} className={inputClass} />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5 font-bold text-slate-300">
                <span>Số sao</span>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputClass}>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} sao</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5 font-bold text-slate-300">
                <span>Trạng thái</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Review['status'] })}
                  className={inputClass}
                >
                  <option value="APPROVED">Đã duyệt</option>
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="REJECTED">Từ chối</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1.5 font-bold text-slate-300">
              <span>Nội dung đánh giá *</span>
              <textarea required rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className={inputClass} />
            </label>

            <label className="flex items-center gap-2 font-bold text-slate-300">
              <input
                type="checkbox"
                checked={form.rental_verified}
                onChange={(e) => setForm({ ...form, rental_verified: e.target.checked })}
                className="size-4 accent-cyan-500"
              />
              Khách thuê đã xác minh
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2.5 font-bold text-slate-300">
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 font-black text-slate-950 disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu đánh giá'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
