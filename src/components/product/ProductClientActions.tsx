'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import BookingModal from '../booking/BookingModal';
import { Calendar, PhoneCall, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { formatVND } from './ProductCard';

interface ProductClientActionsProps {
  product: Product;
}

export default function ProductClientActions({ product }: ProductClientActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Dynamic Rental Price Summary */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/80 shadow-cute flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block font-bold">Giá thuê trọn gói theo ngày:</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-black text-[#FF3877]">
              {formatVND(product.rental_price_per_day)}
            </span>
            <span className="text-sm text-slate-500 font-extrabold">/ 24h</span>
          </div>
          <span className="text-xs text-pink-600 flex items-center gap-1 mt-1 font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Giảm thêm 15% khi thuê từ 3 ngày trở lên!
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-sm shadow-cute hover:shadow-cute-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Kiểm Tra Lịch & Đặt Thuê 💖</span>
          </button>
        </div>
      </div>

      {/* Quick Trust Assurances */}
      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-pink-100 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tặng thẻ SanDisk 128GB + Pin sạc đầy</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-pink-100 shadow-sm">
          <PhoneCall className="w-4 h-4 text-[#FF3877] shrink-0" />
          <span>Hỗ trợ hướng dẫn quay 1-1 qua Zalo 24/7</span>
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
