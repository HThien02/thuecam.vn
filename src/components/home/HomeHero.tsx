'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera, MapPin, ShieldCheck, Sparkles, Store } from 'lucide-react';

type HomeHeroProps = { image?: string };

const brands = [
  { name: 'SONY', slug: 'sony', className: 'bg-white border-slate-800 text-slate-900' },
  { name: 'CANON', slug: 'canon', className: 'bg-[#fff0f5] border-slate-800 text-slate-900' },
  { name: 'FUJI', slug: 'fujifilm', className: 'bg-[#eef9ff] border-slate-800 text-slate-900' },
  { name: 'POCKET', slug: 'pocket-camera', className: 'bg-[#ffe77d] border-slate-800 text-slate-900' },
];

const gear = [
  { name: 'DJI', className: 'bg-[#fff4f8]' },
  { name: 'DJI', className: 'bg-[#fff0f6]' },
  { name: 'Insta360', className: 'bg-[#eafbff]' },
  { name: 'Fujifilm', className: 'bg-[#fff4cf]' },
];

export default function HomeHero({ image }: HomeHeroProps) {
  return (
    <section className="bg-[#fffafb] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
      <div className="mx-auto grid max-w-[1260px] gap-5 lg:grid-cols-[0.95fr_1.35fr]">
        <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[34px] border border-[#ffd5df] bg-white p-7 shadow-[0_18px_50px_rgba(255,91,145,0.12)] sm:p-10 lg:min-h-[550px]">
          <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-[#ffdbe7] blur-[1px]" />
          <div className="relative">
            <span className="inline-flex -rotate-1 rounded-xl bg-[#ff4d91] px-5 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(255,77,145,0.22)]">ƯU ĐÃI CỘNG DỒN</span>
            <p className="mt-5 text-[84px] font-black leading-none tracking-[-0.08em] text-[#ff4d91] sm:text-[104px]">40<span className="text-[56px] align-top tracking-normal">%</span></p>
            <h2 className="max-w-sm text-2xl font-black leading-tight text-[#141a3a] sm:text-3xl">Giảm tối đa tiền thuê</h2>
            <p className="mt-3 max-w-sm text-base font-extrabold leading-7 text-[#141a3a]">First bill -30% theo CCCD<br />+ nhận máy Thứ 6 -10%.</p>
          </div>
          <div className="relative mt-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-[#141a3a] shadow-[0_8px_25px_rgba(23,29,62,0.08)]"><Sparkles className="size-4 text-[#ff4d91]" /> Hệ thống tự tính khi đặt thuê</div>
            <Link href="/thue-camera-du-lich" className="block w-fit rounded-full bg-[#ff4d91] px-7 py-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(255,77,145,0.25)] transition hover:-translate-y-0.5">Đặt thuê ngay</Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#fff5dc] via-[#fff0e4] to-[#ffe8ec] p-7 sm:p-10 lg:min-h-[550px]">
          <div className="absolute -bottom-16 -right-14 size-64 rounded-full bg-[#b7f2e6] opacity-80" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#141a3a] shadow-sm"><MapPin className="size-4 text-[#ff4d91]" /> Cần Thơ, Biên Hòa, Bình Dương</div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-[-0.04em] text-[#141a3a] sm:text-6xl">Thuê máy xịn<br />Chụp chill hết ý!</h1>
            <p className="mt-5 max-w-xl text-sm font-bold leading-6 text-[#68708b] sm:text-base">Ship tận tay tại 3 khu vực, kèm hướng dẫn sử dụng khi giao máy.</p>
            <div className="mt-5 flex flex-wrap gap-2">{brands.map((brand) => <Link key={brand.slug} href={`/thuong-hieu/${brand.slug}`} className={`rounded-full border-2 px-4 py-1.5 text-xs font-black ${brand.className}`}>{brand.name}</Link>)}</div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gear.map((item, index) => <div key={`${item.name}-${index}`} className={`relative flex h-44 flex-col items-center justify-between rounded-t-[80px] rounded-b-xl border-2 border-[#ffb8cf] p-3 ${item.className}`}><span className="rounded-full border-2 border-slate-700 bg-white px-3 py-1 text-[10px] font-black">{item.name}</span>{image ? <Image src={image} alt={`${item.name} cho thuê`} width={110} height={105} className="h-24 w-24 object-contain mix-blend-multiply" /> : <Camera className="size-16 text-slate-700" />}<span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 bg-[#ffb8cf]" /> </div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-[1260px] gap-5 md:grid-cols-2">
        <div className="flex items-center gap-5 rounded-[28px] border border-[#ffc8d8] bg-[#fff5fa] p-6"><div className="rounded-2xl bg-white p-4 text-[#ff4d91] shadow-sm"><ShieldCheck className="size-9" /></div><div><p className="text-xs font-black uppercase text-[#ff4d91]">Cọc linh hoạt</p><h2 className="mt-1 text-2xl font-black text-[#141a3a]">Thương lượng qua tin nhắn</h2><p className="mt-1 text-sm font-medium text-slate-500">Shop xác nhận theo thiết bị, giấy tờ và lịch thuê.</p></div></div>
        <div className="flex items-center gap-5 rounded-[28px] border border-[#cbe7f5] bg-[#f0f9ff] p-6"><div className="rounded-2xl bg-white p-4 text-[#1689cc] shadow-sm"><Store className="size-9" /></div><div><p className="text-xs font-black uppercase text-[#1689cc]">Điểm hẹn nhận máy</p><h2 className="mt-1 text-2xl font-black text-[#141a3a]">Gần ĐH FPT và Bcons City</h2><p className="mt-1 text-sm font-medium text-slate-500">Có thể nhận tại điểm hẹn hoặc ship tận tay.</p></div></div>
      </div>
    </section>
  );
}
