import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, ClipboardCheck, PhoneCall, ShieldCheck, Wallet, LogIn } from 'lucide-react';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ConsignmentFormClient from '@/components/consignment/ConsignmentFormClient';

export const metadata: Metadata = constructMetadata({
  title: 'Ký Gửi Cho Thuê Camera, Flycam, Gimbal - Kiếm Thu Nhập Thụ Động | THUECAM',
  description:
    'Ký gửi máy quay, action camera, flycam cho THUECAM cho thuê. Đăng ký online, được liên hệ kiểm máy, nhận tài khoản theo dõi lịch thuê và doanh thu minh bạch.',
  canonicalPath: '/ky-gui',
});

const steps = [
  { icon: ClipboardCheck, title: 'Gửi đơn đăng ký', text: 'Điền thông tin thiết bị bạn muốn ký gửi ngay bên dưới.' },
  { icon: PhoneCall, title: 'THUECAM liên hệ', text: 'Chúng tôi gọi lại, hẹn kiểm máy và thống nhất tỷ lệ chia doanh thu.' },
  { icon: CalendarCheck, title: 'Nhận tài khoản', text: 'Được cấp tài khoản đối tác để theo dõi máy đang được ai thuê, khi nào.' },
  { icon: Wallet, title: 'Nhận doanh thu', text: 'Đối soát minh bạch theo từng đơn thuê của chính máy bạn.' },
];

export default function KyGuiPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Ký gửi cho thuê', url: '/ky-gui' }]} />

      <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="badge-verified">Chương trình đối tác ký gửi</span>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ký gửi thiết bị cho thuê cùng THUECAM
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
            Máy quay, action camera, flycam hay gimbal đang để không? Ký gửi cho THUECAM vận hành cho thuê, bạn theo dõi lịch thuê và doanh thu của chính thiết bị mình qua tài khoản đối tác.
          </p>
        </div>
        <Link href="/doi-tac/dang-nhap" className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 md:self-auto">
          <LogIn className="h-4 w-4" />
          Đối tác đã có tài khoản
        </Link>
      </header>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <step.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-black text-slate-400">BƯỚC {index + 1}</span>
            </div>
            <h2 className="font-bold text-slate-900">{step.title}</h2>
            <p className="text-sm text-slate-600">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-4 rounded-2xl bg-slate-900 p-6 text-slate-200">
          <h2 className="text-lg font-bold text-white">Quyền lợi đối tác</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-sky-400" />Khách thuê được xác minh CCCD và đặt cọc trước khi nhận máy.</li>
            <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-sky-400" />Máy được kiểm tra, vệ sinh sau mỗi lượt thuê.</li>
            <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-sky-400" />Theo dõi lịch thuê, trạng thái đơn và doanh thu dự kiến theo thời gian thực.</li>
            <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-sky-400" />Có thể rút máy về khi không còn lịch thuê đang chạy.</li>
          </ul>
        </aside>
        <section aria-labelledby="form-heading" className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="form-heading" className="mb-4 text-lg font-bold text-slate-900">Đăng ký ký gửi</h2>
          <ConsignmentFormClient />
        </section>
      </div>
    </div>
  );
}
