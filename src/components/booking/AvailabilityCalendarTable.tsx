'use client';

import React, { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';

interface AvailabilityCalendarTableProps {
  productId?: string;
  productName?: string;
  dailyPrice?: number;
  depositAmount?: number;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  onRangeAvailabilityChange?: (isAvailable: boolean | null) => void;
}

// Helper to format Date to YYYY-MM-DD in local time
const formatDateKey = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

async function fetchAvailability(url: string): Promise<{ reservedDates: string[] }> {
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'Không thể tải lịch trống.');
  return result;
}

const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function AvailabilityCalendarTable({
  productId,
  productName = 'Thiết bị',
  dailyPrice = 150000,
  depositAmount = 2000000,
  startDate,
  endDate,
  onDateChange,
  onRangeAvailabilityChange,
}: AvailabilityCalendarTableProps) {
  // Current viewing month offset (0 = current month, 1 = next month)
  const [monthOffset, setMonthOffset] = useState(0);

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);

  // Target month view
  const viewingDate = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [today, monthOffset]);

  const monthName = useMemo(() => {
    return new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(viewingDate);
  }, [viewingDate]);

  const firstVisibleDate = formatDateKey(new Date(viewingDate.getFullYear(), viewingDate.getMonth(), -6));
  const lastVisibleDate = formatDateKey(new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 7));
  const availabilityQuery = productId
    ? `/api/availability?${new URLSearchParams({ productId, startDate: firstVisibleDate, endDate: lastVisibleDate })}`
    : null;
  const { data: availability, isLoading: isLoadingAvailability, error: availabilityError } = useSWR(availabilityQuery, fetchAvailability, {
    revalidateOnFocus: false,
    keepPreviousData: false,
  });
  const reservedDates = useMemo(() => new Set(availability?.reservedDates ?? []), [availability?.reservedDates]);

  // Generate calendar days for the viewing month
  const calendarDays = useMemo(() => {
    const year = viewingDate.getFullYear();
    const month = viewingDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday is index 0 in Vietnamese calendar (getUTCDay or getDay adjustment)
    // 0 is Sunday, 1 is Monday ...
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Sunday is 6

    const totalDays = lastDayOfMonth.getDate();
    const days: { dateKey: string; dayNum: number; isCurrentMonth: boolean; isPast: boolean }[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const key = formatDateKey(d);
      days.push({
        dateKey: key,
        dayNum: prevMonthLastDay - i,
        isCurrentMonth: false,
        isPast: key < todayKey,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const key = formatDateKey(d);
      days.push({
        dateKey: key,
        dayNum: i,
        isCurrentMonth: true,
        isPast: key < todayKey,
      });
    }

    // Next month padding to fill grid
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const key = formatDateKey(d);
      days.push({
        dateKey: key,
        dayNum: i,
        isCurrentMonth: false,
        isPast: false,
      });
    }

    return days;
  }, [viewingDate, todayKey]);

  // User click on a calendar date
  const handleDateClick = (key: string, isPast: boolean) => {
    if (isPast) return;

    if (!startDate || (startDate && endDate)) {
      // First click: select new start date
      onDateChange(key, '');
    } else if (startDate && !endDate) {
      // Second click: select end date
      if (key < startDate) {
        // If clicked date is before start date, treat as new start date
        onDateChange(key, '');
      } else {
        onDateChange(startDate, key);
      }
    }
  };

  // Check if range has conflicts
  const rangeInfo = useMemo(() => {
    if (!startDate || !endDate || !availability) return null;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const diffMs = end.getTime() - start.getTime();
    const daysCount = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);

    // Collect all dates in range
    const conflictDates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const k = formatDateKey(cur);
      if (reservedDates.has(k)) {
        conflictDates.push(k);
      }
      cur.setDate(cur.getDate() + 1);
    }

    const hasConflict = conflictDates.length > 0;
    const baseTotal = daysCount * dailyPrice;
    const discountRate = daysCount >= 7 ? 0.2 : daysCount >= 3 ? 0.1 : 0;
    const discountAmount = Math.round(baseTotal * discountRate);
    const finalTotal = baseTotal - discountAmount;

    return {
      daysCount,
      hasConflict,
      conflictDates,
      baseTotal,
      discountRate,
      discountAmount,
      finalTotal,
    };
  }, [startDate, endDate, reservedDates, dailyPrice, availability]);

  useEffect(() => {
    if (!onRangeAvailabilityChange) return;
    if (availabilityError || !availability || !rangeInfo) {
      onRangeAvailabilityChange(null);
      return;
    }
    onRangeAvailabilityChange(!rangeInfo.hasConflict);
  }, [availability, availabilityError, rangeInfo, onRangeAvailabilityChange]);

  return (
    <div className="rounded-[28px] border-2 border-sky-100 bg-white p-4 sm:p-6 shadow-cute">
      {/* Header with Title and Month Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-black uppercase text-[#0284c7]">
            <CalendarIcon className="size-3.5" /> Bảng lịch kiểm tra máy trống
          </div>
          <h4 className="mt-1 text-base sm:text-lg font-black text-slate-900">
            Lịch Thuê Máy: <span className="text-[#0284c7]">{productName}</span>
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Màu xanh là ngày <strong>còn máy sẵn sàng</strong>, màu xám gạch là ngày <strong>đã kín lịch</strong>.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={monthOffset <= 0}
            onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
            className="p-2 rounded-xl border border-sky-200 text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Tháng trước"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-32 text-center text-xs font-black uppercase tracking-wider text-slate-800 bg-sky-50 py-2 px-3 rounded-xl border border-sky-200">
            {monthName}
          </span>
          <button
            type="button"
            disabled={monthOffset >= 3}
            onClick={() => setMonthOffset((prev) => Math.min(3, prev + 1))}
            className="p-2 rounded-xl border border-sky-200 text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Tháng sau"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex flex-wrap items-center gap-4 py-3 text-xs font-bold text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded-md bg-emerald-50 border border-emerald-400 inline-block" />
          <span className="text-emerald-700">Còn máy trống</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded-md bg-slate-100 border border-slate-300 inline-block line-through text-[9px] text-center leading-3 text-slate-400">×</span>
          <span className="text-slate-500">Đã full lịch</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded-md bg-[#0284c7] inline-block" />
          <span className="text-[#0284c7]">Lịch bạn đang chọn</span>
        </span>
      </div>

      {/* Calendar Grid Table */}
      <div className="mt-2 overflow-hidden rounded-2xl border border-sky-100 bg-white">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-sky-50/80 text-center text-xs font-black text-slate-700 border-b border-sky-100 py-2">
          {DAY_NAMES.map((name, i) => (
            <div key={name} className={i >= 5 ? 'text-amber-600' : ''}>
              {name}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 p-1 sm:p-2">
          {calendarDays.map((item) => {
            const isReserved = reservedDates.has(item.dateKey);
            const isStart = startDate === item.dateKey;
            const isEnd = endDate === item.dateKey;
            const inRange = startDate && endDate && item.dateKey >= startDate && item.dateKey <= endDate;
            const isToday = item.dateKey === todayKey;

            let cellClass = 'bg-emerald-50/70 border-emerald-200 text-slate-800 hover:bg-emerald-100 hover:border-emerald-400';
            let statusText = 'Còn';
            let statusColor = 'text-emerald-600 font-extrabold';

            if (item.isPast) {
              cellClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed';
              statusText = '-';
              statusColor = 'text-slate-400';
            } else if (isReserved) {
              cellClass = 'bg-slate-100 border-slate-300 text-slate-400 line-through cursor-not-allowed';
              statusText = 'Full';
              statusColor = 'text-slate-400 font-bold';
            }

            if ((isStart || isEnd) && isReserved) {
              cellClass = 'bg-rose-100 border-rose-300 text-rose-900';
              statusText = 'Full';
              statusColor = 'text-rose-700 font-black';
            } else if (isStart || isEnd) {
              cellClass = 'bg-[#0284c7] border-[#0284c7] text-white shadow-md z-10';
              statusText = isStart && isEnd ? '1 ngày' : isStart ? 'Nhận' : 'Trả';
              statusColor = 'text-white font-black';
            } else if (inRange) {
              if (isReserved) {
                cellClass = 'bg-rose-100 border-rose-300 text-rose-900';
                statusText = 'Trùng';
                statusColor = 'text-rose-600 font-black';
              } else {
                cellClass = 'bg-sky-100 border-sky-300 text-[#0284c7] font-black';
                statusText = 'Chọn';
                statusColor = 'text-[#0284c7] font-bold';
              }
            }

            return (
              <button
                key={item.dateKey}
                type="button"
                disabled={item.isPast}
                onClick={() => handleDateClick(item.dateKey, item.isPast)}
                className={`group relative flex min-h-[58px] sm:min-h-[64px] flex-col items-center justify-between rounded-xl border p-1.5 transition-all text-xs ${cellClass}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className={`text-xs font-black ${isStart || isEnd ? 'text-white' : item.isCurrentMonth ? '' : 'opacity-40'}`}>
                    {item.dayNum}
                  </span>
                  {isToday && !(isStart || isEnd) && (
                    <span className="size-1.5 rounded-full bg-[#0284c7]" title="Hôm nay" />
                  )}
                </div>

                <span className={`text-[10px] uppercase tracking-tight ${statusColor}`}>
                  {statusText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Range Status / Alerts */}
      <div className="mt-4">
        {isLoadingAvailability && !availability ? (
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 p-3.5 text-xs font-semibold text-sky-800" role="status" aria-live="polite">
            <span className="size-4 animate-spin rounded-full border-2 border-sky-600 border-r-transparent" aria-hidden="true" />
            Đang tải lịch thiết bị…
          </div>
        ) : availabilityError ? (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800" role="alert">
            <AlertTriangle className="size-4 shrink-0" />
            Không tải được lịch. Vui lòng thử lại sau.
          </div>
        ) : rangeInfo ? (
          rangeInfo.hasConflict ? (
            <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-sm text-rose-900">
                  Lịch trình có ngày đã kín máy!
                </strong>
                <span>
                  Ngày ({rangeInfo.conflictDates.join(', ')}) đã có khách đặt trước. Vui lòng chọn khoảng ngày khác hoặc liên hệ hotline để mượn máy tương đương tại ETown Tân Bình.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-sky-50/80 border-2 border-sky-200 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sky-900">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-black">
                  Thiết bị còn sẵn sàng trong suốt {rangeInfo.daysCount} ngày ({startDate} đến {endDate})! 🎉
                </span>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-sky-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Số ngày thuê:</span>
                  <strong className="text-slate-900 font-black">{rangeInfo.daysCount} ngày (24h/ngày)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Đơn giá thuê:</span>
                  <strong className="text-[#0284c7] font-black">{dailyPrice.toLocaleString('vi-VN')}đ/ngày</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Tiền cọc thiết bị:</span>
                  <strong className="text-amber-600 font-bold">{depositAmount.toLocaleString('vi-VN')}đ (hoặc giữ CCCD)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Tổng tiền thuê:</span>
                  <strong className="text-base text-[#0284c7] font-black">
                    {rangeInfo.finalTotal.toLocaleString('vi-VN')}đ
                  </strong>
                  {rangeInfo.discountAmount > 0 && (
                    <span className="block text-[10px] text-emerald-600 font-bold">
                      ��ã giảm {rangeInfo.discountAmount.toLocaleString('vi-VN')}đ (-{rangeInfo.discountRate * 100}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2.5 rounded-2xl bg-sky-50 border border-sky-200 p-3.5 text-xs text-sky-800">
            <Info className="size-4 text-[#0284c7] shrink-0" />
            <span>
              <strong>Mẹo đặt lịch nhanh:</strong> Nhấp vào ngày bạn muốn nhận máy (Bắt đầu), sau đó nhấp vào ngày trả máy (Kết thúc) trên bảng lịch.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
