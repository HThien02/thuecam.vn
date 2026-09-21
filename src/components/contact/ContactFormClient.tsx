'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
        <h3 className="font-bold text-white text-base">Gửi Yêu Cầu Thành Công!</h3>
        <p className="text-slate-300">
          Cảm ơn bạn <strong className="text-cyan-400">{name}</strong>. Đội ngũ kỹ thuật viên THUECAM sẽ liên hệ lại qua số điện thoại <strong className="text-white">{phone}</strong> trong vòng 10 phút.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      <div>
        <label className="block text-slate-300 mb-1 font-semibold">Họ và tên của bạn: *</label>
        <input
          type="text"
          required
          placeholder="Ví dụ: Hoàng Long"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="block text-slate-300 mb-1 font-semibold">Số điện thoại Zalo: *</label>
        <input
          type="tel"
          required
          placeholder="0901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="block text-slate-300 mb-1 font-semibold">Nhu cầu hoặc máy bạn quan tâm:</label>
        <textarea
          rows={3}
          placeholder="Ví dụ: Tôi muốn thuê DJI Pocket 4 đi Đà Lạt 3 ngày cuối tuần này..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
      </button>
    </form>
  );
}
