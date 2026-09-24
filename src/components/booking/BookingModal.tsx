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
  MapPin,
  Truck,
  RotateCw,
} from 'lucide-react';
import AvailabilityCalendarTable from './AvailabilityCalendarTable';
import SafeButton from '@/components/common/SafeButton';
import {
  isValidVietnamPhone,
  isValidEmail,
  isValidName,
  PHONE_VALIDATION_ERROR,
  EMAIL_VALIDATION_ERROR,
  NAME_VALIDATION_ERROR,
} from '@/lib/security/validation';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Booking result
  const [bookingCode, setBookingCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  if (!isOpen) return null;

  // Calculate rental days
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const totalDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const baseRentalPrice = totalDays * product.rental_price_per_day;
  const discountRate = totalDays >= 7 ? 0.2 : totalDays >= 3 ? 0.1 : 0;
  const discountAmount = Math.round(baseRentalPrice * discountRate);
  const totalRentalPrice = baseRentalPrice - discountAmount;
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
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!isValidName(customerName)) {
      newErrors.customerName = NAME_VALIDATION_ERROR;
    }
    if (!isValidVietnamPhone(customerPhone)) {
      newErrors.customerPhone = PHONE_VALIDATION_ERROR;
    }
    if (!isValidEmail(customerEmail)) {
      newErrors.customerEmail = EMAIL_VALIDATION_ERROR;
    }
    if (pickupMethod === 'DELIVERY' && (!address || address.trim().length < 5)) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao nhận cụ thể (tối thiểu 5 ký tự).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const generatedCode = `TC${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingCode(generatedCode);

    // Save booking to admin storage so admin dashboard displays it in table immediately!
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem('thuecam_bookings');
        const bookingsList = existing ? JSON.parse(existing) : [];
        bookingsList.unshift({
          id: generatedCode,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          product_id: product.id,
          product_name: product.name,
          start_date: startDate,
          end_date: endDate,
          total_days: totalDays,
          total_price: totalDueNow,
          deposit_amount: deposit,
          pickup_method: pickupMethod === 'STORE' ? 'ETown Tân Bình' : `Giao: ${address}`,
          status: 'PENDING',
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('thuecam_bookings', JSON.stringify(bookingsList));
      } catch {
        // ignore
      }
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white border-2 border-sky-100 shadow-2xl p-5 sm:p-7 text-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#0284c7] hover:bg-sky-50 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CALENDAR AVAILABILITY TABLE */}
        {step === 'CALENDAR' && (
          <div className="space-y-5">
            <div>
              <span className="badge-rental mb-2">Bước 1/3: Chọn Ngày Đi Chơi</span>
              <h3 className="text-xl font-black text-slate-900">Kiểm Tra Lịch & Đặt Thuê 📸</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Thiết bị: <strong className="text-slate-800">{product.name}</strong>
              </p>
            </div>

            {/* Visual Schedule Table Component */}
            <AvailabilityCalendarTable
              productId={product.id}
              productName={product.name}
              dailyPrice={product.rental_price_per_day}
              depositAmount={deposit}
              startDate={startDate}
              endDate={endDate}
              onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />

            {/* Date Pickers for precision input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ngày nhận máy (tại ETown hoặc ship):
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-sky-50/60 border border-sky-200 rounded-2xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#0284c7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ngày hoàn trả máy:
                </label>
                <input
                  type="date"
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-sky-50/60 border border-sky-200 rounded-2xl px-3 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#0284c7]"
                />
              </div>
            </div>

            <button
              onClick={handleStartBooking}
              disabled={!startDate || !endDate}
              className="w-full py-3.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-sm shadow-cute hover:shadow-cute-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" />
              <span>Tiếp Tục Đặt Máy ({totalDays} Ngày - {formatVND(totalDueNow)}) 📸</span>
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
                Lịch thuê {totalDays} ngày: từ <strong className="text-slate-800">{startDate}</strong> đến <strong className="text-slate-800">{endDate}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên của bạn: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                  }}
                  className={`w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition ${
                    errors.customerName
                      ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                      : 'bg-sky-50/60 border-sky-200 text-slate-900 focus:border-[#0284c7]'
                  }`}
                />
                {errors.customerName && (
                  <span className="mt-1 text-[11px] text-rose-500 font-bold block">
                    {errors.customerName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số điện thoại (Bắt đầu từ 0, đủ 10 số): *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
                    }}
                    className={`w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition ${
                      errors.customerPhone
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                        : 'bg-sky-50/60 border-sky-200 text-slate-900 focus:border-[#0284c7]'
                    }`}
                  />
                  {errors.customerPhone && (
                    <span className="mt-1 text-[11px] text-rose-500 font-bold block">
                      {errors.customerPhone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email nhận phiếu thuê & hóa đơn: *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@gmail.com"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (errors.customerEmail) setErrors((prev) => ({ ...prev, customerEmail: '' }));
                    }}
                    className={`w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition ${
                      errors.customerEmail
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                        : 'bg-sky-50/60 border-sky-200 text-slate-900 focus:border-[#0284c7]'
                    }`}
                  />
                  {errors.customerEmail && (
                    <span className="mt-1 text-[11px] text-rose-500 font-bold block">
                      {errors.customerEmail}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Địa điểm & Hình thức nhận máy:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupMethod('STORE')}
                    className={`py-3 px-3 rounded-2xl border text-left transition-all font-bold flex items-center gap-2 ${
                      pickupMethod === 'STORE'
                        ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200'
                    }`}
                  >
                    <MapPin className="size-4 shrink-0 text-[#0284c7]" />
                    <div>
                      <span className="block text-xs">Nhận tại điểm hẹn ETown</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Tân Bình, TP HCM</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupMethod('DELIVERY')}
                    className={`py-3 px-3 rounded-2xl border text-left transition-all font-bold flex items-center gap-2 ${
                      pickupMethod === 'DELIVERY'
                        ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200'
                    }`}
                  >
                    <Truck className="size-4 shrink-0 text-[#0284c7]" />
                    <div>
                      <span className="block text-xs">Giao hỏa tốc 30 phút</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Giao tận nơi toàn TP.HCM</span>
                    </div>
                  </button>
                </div>
              </div>

              {pickupMethod === 'DELIVERY' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Địa chỉ giao nhận máy: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tên đường, phường, quận..."
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    className={`w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition ${
                      errors.address
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                        : 'bg-sky-50/60 border-sky-200 text-slate-900 focus:border-[#0284c7]'
                    }`}
                  />
                  {errors.address && (
                    <span className="mt-1 text-[11px] text-rose-500 font-bold block">
                      {errors.address}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep('CALENDAR')}
                className="w-1/3 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Quay lại
              </button>
              <SafeButton
                type="submit"
                loadingText="Đang tạo đơn..."
                className="w-2/3 py-3 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-xs shadow-cute flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Tiếp Tục Thanh Toán VietQR ({formatVND(totalDueNow)})</span>
              </SafeButton>
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
            <div className="p-4 bg-gradient-to-br from-sky-50 to-white rounded-3xl inline-block mx-auto shadow-cute border-2 border-sky-100">
              <img
                src={vietQrUrl}
                alt="SePay VietQR Code"
                className="w-56 h-56 mx-auto rounded-2xl border border-sky-100 bg-white"
              />
              <p className="text-[11px] text-slate-500 font-bold mt-2">
                Hệ thống xác nhận tự động sau 3 - 5 giây
              </p>
            </div>

            {/* Transfer details */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 max-w-sm mx-auto space-y-1.5 text-xs text-left">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số tiền:</span>
                <span className="font-black text-[#0284c7] text-sm">{formatVND(totalDueNow)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Mã đơn / Nội dung:</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-sky-200">
                    {bookingCode}
                  </span>
                  <button
                    onClick={handleCopyContent}
                    className="p-1 text-slate-500 hover:text-[#0284c7]"
                    title="Sao chép mã"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-600 font-bold">Đã chép!</span>}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-bold text-slate-700">MBBank (Ngân Hàng Quân Đội)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Số tài khoản:</span>
                <span className="font-bold text-slate-700">{bankAccount}</span>
              </div>
            </div>

            {/* Simulating webhook receiver */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateSuccessfulPayment}
                className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3 animate-spin" />
                <span>Mô phỏng SePay đã nhận tiền (Demo)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'SUCCESS' && (
          <div className="space-y-5 text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-cute">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="badge-verified mb-2">Đã Xác Nhận Đơn Hàng</span>
              <h3 className="text-2xl font-black text-slate-900">Đặt Thuê Thành Công! 🎉</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Mã đơn thuê của bạn là <strong className="text-[#0284c7] font-mono text-sm">{bookingCode}</strong>.
                THUECAM sẽ liên hệ qua SĐT/Zalo <strong>{customerPhone}</strong> để chuẩn bị bàn giao máy tại ETown Tân Bình.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="size-4 text-[#0284c7]" />
                <span>Điểm nhận máy: <strong>ETown, Tân Bình, TP HCM</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Đã bao gồm: Thẻ nhớ tốc độ cao + Pin sạc 100%</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs shadow-cute transition-all"
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
