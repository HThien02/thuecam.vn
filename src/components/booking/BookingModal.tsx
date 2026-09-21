'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { formatVND } from '../product/ProductCard';
import { trackEvent } from '@/lib/analytics/gtag';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  Copy,
  CreditCard,
  Sparkles,
  X,
  ShieldCheck,
  Heart,
} from 'lucide-react';

interface BookingModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ product, isOpen, onClose }: BookingModalProps) {
  // Step: 'CALENDAR' | 'CUSTOMER_INFO' | 'PAYMENT_SEPAY' | 'SUCCESS'
  const [step, setStep] = useState<'CALENDAR' | 'CUSTOMER_INFO' | 'PAYMENT_SEPAY' | 'SUCCESS'>('CALENDAR');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);

  // Customer form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'STORE' | 'DELIVERY'>('STORE');
  const [address, setAddress] = useState('');

  // Booking result
  const [bookingCode, setBookingCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  if (!isOpen) return null;

  // Calculate rental days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(1, end.getTime() - start.getTime());
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalRentalPrice = totalDays * product.rental_price_per_day;
  const deposit = product.deposit_amount;
  const totalDueNow = totalRentalPrice; // Customer pays rental fee; deposit settled upon pickup or CCCD

  const handleStartBooking = () => {
    trackEvent({
      action: 'availability_check',
      params: {
        item_id: product.id,
        start_date: startDate,
        end_date: endDate,
        is_available: true,
      },
    });

    trackEvent({
      action: 'booking_start',
      params: {
        item_id: product.id,
        item_name: product.name,
        daily_price: product.rental_price_per_day,
      },
    });

    setStep('CUSTOMER_INFO');
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = `TC${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingCode(generatedCode);

    trackEvent({
      action: 'booking_created',
      params: {
        booking_code: generatedCode,
        item_id: product.id,
        total_days: totalDays,
        total_price: totalDueNow,
      },
    });

    trackEvent({
      action: 'payment_started',
      params: {
        booking_code: generatedCode,
        amount: totalDueNow,
        method: 'SePay_VietQR',
      },
    });

    setStep('PAYMENT_SEPAY');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateSuccessfulPayment = () => {
    setPaymentVerified(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    trackEvent({
      action: 'payment_success',
      params: {
        booking_code: bookingCode,
        amount: totalDueNow,
      },
    });

    setTimeout(() => {
      setStep('SUCCESS');
    }, 1200);
  };

  // SePay VietQR URL standard:
  const bankAccount = '9999888877';
  const bankCode = 'MBBank';
  const vietQrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankCode}&amount=${totalDueNow}&des=${bookingCode}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-pink-100 shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-[#FF3877] hover:bg-pink-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: DATES & AVAILABILITY */}
        {step === 'CALENDAR' && (
          <div className="space-y-5">
            <div>
              <span className="badge-rental mb-2">Bước 1/3: Chọn Ngày Đi Chơi</span>
              <h3 className="text-xl font-black text-slate-900">Kiểm Tra Lịch & Đặt Thuê 📸</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{product.name}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ngày nhận máy:
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#FF3877]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ngày trả máy:
                </label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#FF3877]"
                />
              </div>
            </div>

            {/* Price breakdown box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-white border border-pink-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Số ngày thuê tính:</span>
                <span className="font-extrabold text-slate-900">{totalDays} ngày (24h/ngày)</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Đơn giá thuê:</span>
                <span className="font-bold text-[#FF3877]">{formatVND(product.rental_price_per_day)}/ngày</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Tiền cọc thiết bị (hoàn 100% khi trả máy):</span>
                <span className="text-amber-600 font-bold">{formatVND(deposit)} (hoặc giữ CCCD)</span>
              </div>
              <div className="pt-2 border-t border-pink-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">Tổng tiền thuê tạm tính:</span>
                <span className="text-xl font-black text-[#FF3877]">
                  {formatVND(totalRentalPrice)}
                </span>
              </div>
            </div>

            <button
              onClick={handleStartBooking}
              className="w-full py-3.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-sm shadow-cute hover:shadow-cute-lg transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Máy Còn Sẵn - Tiếp Tục Đặt Máy 💖</span>
            </button>
          </div>
        )}

        {/* STEP 2: CUSTOMER INFORMATION */}
        {step === 'CUSTOMER_INFO' && (
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div>
              <span className="badge-rental mb-2">Bước 2/3: Người Nhận Máy</span>
              <h3 className="text-xl font-black text-slate-900">Thông Tin Liên Hệ</h3>
              <p className="text-xs text-slate-500 mt-1">
                Thuê {totalDays} ngày ({startDate} đến {endDate})
              </p>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên của bạn: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Long"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF3877]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số điện thoại / Zalo: *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF3877]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email nhận phiếu thuê: *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF3877]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình thức nhận máy:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupMethod('STORE')}
                    className={`py-2 px-3 rounded-2xl border text-center transition-all font-bold ${
                      pickupMethod === 'STORE'
                        ? 'bg-pink-50 border-[#FF3877] text-[#FF3877]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-pink-200'
                    }`}
                  >
                    Nhận tại Showroom
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupMethod('DELIVERY')}
                    className={`py-2 px-3 rounded-2xl border text-center transition-all font-bold ${
                      pickupMethod === 'DELIVERY'
                        ? 'bg-pink-50 border-[#FF3877] text-[#FF3877]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-pink-200'
                    }`}
                  >
                    Giao hỏa tốc 30 phút
                  </button>
                </div>
              </div>

              {pickupMethod === 'DELIVERY' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Địa chỉ nhận máy: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tên đường, phường, quận..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-2xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF3877]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('CALENDAR')}
                className="w-1/3 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-xs shadow-cute flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Tiếp Tục Thanh Toán VietQR</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SEPAY VIETQR PAYMENT */}
        {step === 'PAYMENT_SEPAY' && (
          <div className="space-y-4 text-center">
            <div>
              <span className="badge-rental mb-2">Bước 3/3: Thanh Toán Tự Động</span>
              <h3 className="text-xl font-black text-slate-900">Quét Mã VietQR SePay ✨</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mở app ngân hàng bất kỳ quét mã là thanh toán xong ngay
              </p>
            </div>

            {/* QR display box */}
            <div className="p-4 bg-gradient-to-br from-pink-50 to-white rounded-3xl inline-block mx-auto shadow-cute border border-pink-100">
              <img
                src={vietQrUrl}
                alt="SePay VietQR Code"
                className="w-56 h-56 mx-auto object-contain rounded-xl"
              />
            </div>

            <div className="space-y-2 text-xs bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-left">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Số tiền cần thanh toán:</span>
                <span className="text-base font-black text-[#FF3877]">
                  {formatVND(totalDueNow)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Nội dung chuyển khoản (bắt buộc):</span>
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-[#FF3877] font-mono font-black shadow-sm"
                >
                  <span>{bookingCode}</span>
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-emerald-600 font-bold text-right">
                  ✓ Đã sao chép nội dung chuyển khoản!
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleSimulateSuccessfulPayment}
                disabled={paymentVerified}
                className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {paymentVerified ? 'Đang xác nhận giao dịch...' : 'Tôi Đã Chuyển Khoản Thành Công'}
                </span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                Hệ thống tự động đối soát SePay 24/7. Hỗ trợ hotline: 0901.234.567.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'SUCCESS' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Đặt Thuê Thành Công! 🎉</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Mã đơn hàng của bạn:{' '}
                <strong className="text-[#FF3877] font-mono text-sm font-black">{bookingCode}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs text-left space-y-2 text-slate-700">
              <p>
                <strong>Thiết bị:</strong> {product.name}
              </p>
              <p>
                <strong>Thời gian thuê:</strong> {startDate} đến {endDate} ({totalDays} ngày)
              </p>
              <p>
                <strong>Khách hàng:</strong> {customerName} ({customerPhone})
              </p>
              <p className="text-emerald-600 flex items-center gap-1 font-bold pt-1">
                <Sparkles className="w-4 h-4" />
                Kỹ thuật viên THUECAM sẽ gọi xác nhận bàn giao trong vòng 10 phút.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
