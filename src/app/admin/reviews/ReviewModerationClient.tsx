'use client';

import React, { useState } from 'react';
import { Review, Product } from '@/types';
import { Star, CheckCircle2, XCircle, ShieldCheck, Trash2, Filter } from 'lucide-react';
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
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Tất cả ({reviews.length})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Đã Duyệt ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'PENDING'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Chờ Duyệt ({reviews.filter((r) => r.status === 'PENDING').length})
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

              <p className="text-slate-300 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

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
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Từ Chối</span>
                  </button>
                )}
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
      </div>
    </div>
  );
}
