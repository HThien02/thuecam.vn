'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import BookingModal from '../booking/BookingModal';
import { Calendar, PhoneCall, ShieldCheck, Zap } from 'lucide-react';
import { formatVND } from './ProductCard';

interface ProductClientActionsProps {
  product: Product;
}

export default function ProductClientActions({ product }: ProductClientActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canRent = product.status === 'ACTIVE';
  const statusMessage = product.status === 'MAINTENANCE'
    ? 'Thiết bị đang bảo trì nên tạm thời chưa thể đặt thuê.'
    : product.status === 'ARCHIVED'
      ? 'Sản phẩm đã ngừng kinh doanh và hiện không nhận đặt thuê.'
      : !canRent
        ? 'Shop đang tạm ngưng cho thuê thiết bị này.'
        : 'Hiện full lịch thuê; bạn vẫn có thể xem lịch và chọn ngày còn trống khi có.';
  const actionLabel = !canRent
    ? product.status === 'MAINTENANCE' ? 'Đang bảo trì' : product.status === 'ARCHIVED' ? 'Ngừng kinh doanh' : 'Tạm ngưng cho thuê'
    : product.inventory_count <= 0 ? 'Xem lịch thuê' : 'Kiểm Tra Lịch & Đặt Thuê';

  return (
    <div className="space-y-4">
      {/* Dynamic Rental Price Summary */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 border-2 border-sky-200/80 shadow-cute flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block font-bold">Giá thuê trọn gói theo ngày:</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-black text-[#0284c7]">
              {formatVND(product.rental_price_per_day)}
            </span>
            <span className="text-sm text-slate-500 font-extrabold">/ 24h</span>
          </div>
          <span className="text-xs text-sky-700 flex items-center gap-1 mt-1 font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Giảm thêm 15% khi thuê từ 3 ngày trở lên!
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={!canRent}
            aria-describedby={!canRent || product.inventory_count <= 0 ? 'product-unavailable-message' : undefined}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-sm shadow-cute hover:shadow-cute-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            <Calendar className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
          {(!canRent || product.inventory_count <= 0) && (
            <p id="product-unavailable-message" role="status" className="max-w-56 text-center text-xs font-semibold text-amber-800">
              {statusMessage}
            </p>
          )}
        </div>
      </div>

      {/* Quick Trust Assurances */}
      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-sky-100 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tặng thẻ SanDisk 128GB + Pin sạc đầy</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-sky-100 shadow-sm">
          <PhoneCall className="w-4 h-4 text-[#0284c7] shrink-0" />
          <span>Nhận tại ETown Tân Bình hoặc ship 30p</span>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
