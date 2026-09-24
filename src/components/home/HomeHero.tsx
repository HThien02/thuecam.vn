'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera, MapPin, ShieldCheck, Sparkles, Store, Calendar, ArrowRight } from 'lucide-react';

type HomeHeroProps = { image?: string };

const brands = [
  { name: 'SONY', slug: 'sony', className: 'bg-[#e0f2fe] border-[#0284c7] text-[#0c2340]' },
  { name: 'CANON', slug: 'canon', className: 'bg-[#f0f9ff] border-[#0284c7] text-[#0c2340]' },
  { name: 'FUJI', slug: 'fujifilm', className: 'bg-[#e0f2fe] border-[#0284c7] text-[#0c2340]' },
  { name: 'POCKET', slug: 'pocket-camera', className: 'bg-[#fef9c3] border-[#ca8a04] text-[#713f12]' },
];

const gear = [
  { name: 'DJI', className: 'bg-[#e0f2fe]' },
  { name: 'GO PRO', className: 'bg-[#f0f9ff]' },
  { name: 'INSTA360', className: 'bg-[#e0f7fa]' },
  { name: 'FUJIFILM', className: 'bg-[#fef9c3]' },
];

export default function HomeHero({ image }: HomeHeroProps) {
  return (
    <section className="bg-[#f0f7ff] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
      <div className="mx-auto grid max-w-[1260px] gap-5 lg:grid-cols-[0.95fr_1.35fr]">
        <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[38px] border-2 border-[#bae6fd] bg-gradient-to-br from-[#e0f2fe] to-white p-7 shadow-[0_18px_50px_rgba(2,132,199,0.12)] sm:p-10 lg:min-h-[550px]">
          <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-[#bae6fd]/50" />
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#fef9c3]" />
          <div className="relative">
            <span className="inline-flex -rotate-2 rounded-2xl bg-[#0284c7] px-5 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(2,132,199,0.25)]">
              ƯU ĐÃI CHIBI NHỎ XINH 🎒
            </span>
            <p className="mt-5 text-[84px] font-black leading-none tracking-[-0.08em] text-[#0284c7] sm:text-[104px]">
              30<span className="text-[56px] align-top tracking-normal">%</span>
            </p>
            <h2 className="max-w-sm text-2xl font-black leading-tight text-[#0c2340] sm:text-3xl">
              Thuê càng lâu càng hời
            </h2>
            <p className="mt-3 max-w-sm text-base font-extrabold leading-7 text-[#334e68]">
              Giảm thêm cho lịch thuê cuối tuần<br />và nhóm bạn đi chơi cùng nhau! 🏖️
            </p>
          </div>
          <div className="relative mt-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-[#0c2340] shadow-[0_8px_25px_rgba(2,132,199,0.1)]">
              <Sparkles className="size-4 text-[#0ea5e9]" /> Chọn máy, shop lo phần còn lại
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dat-thue" className="inline-flex items-center gap-2 rounded-full bg-[#0284c7] px-7 py-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(2,132,199,0.3)] transition hover:-translate-y-0.5 hover:bg-[#0369a1]">
                <Calendar className="size-4" /> Xem lịch máy trống
              </Link>
              <Link href="/bang-gia" className="inline-flex items-center gap-2 rounded-full border-2 border-[#bae6fd] bg-white px-6 py-4 text-sm font-black text-[#0284c7] transition hover:bg-sky-50">
                Bảng giá <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[38px] border-2 border-[#bae6fd] bg-gradient-to-br from-[#e0f2fe]/60 via-[#f0f9ff] to-white p-7 sm:p-10 lg:min-h-[550px] shadow-[0_18px_50px_rgba(2,132,199,0.08)]">
          <div className="absolute -bottom-16 -right-14 size-72 rounded-full bg-[#bae6fd]/40" />
          <div className="absolute -left-16 top-24 size-48 rounded-full bg-[#fef9c3]/50" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#0c2340] shadow-sm border border-[#bae6fd]">
              <MapPin className="size-4 text-[#0284c7]" /> Nhận máy nhanh tại ETown Tân Bình
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-[-0.04em] text-[#0c2340] sm:text-6xl">
              Bấm máy thật vui<br />Lưu chuyến đi thật xinh
            </h1>
            <p className="mt-5 max-w-xl text-sm font-bold leading-6 text-[#334e68] sm:text-base">
              Máy gọn, dễ dùng, phụ kiện đủ đầy cho mọi cuộc hẹn và chuyến đi khám phá.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Link key={brand.slug} href={`/thuong-hieu/${brand.slug}`} className={`rounded-full border-2 px-4 py-1.5 text-xs font-black ${brand.className}`}>
                  {brand.name}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gear.map((item, index) => (
                <div key={`${item.name}-${index}`} className={`relative flex h-44 flex-col items-center justify-between rounded-t-[80px] rounded-b-2xl border-2 border-[#7dd3fc] p-3 ${item.className} shadow-sm transition hover:-translate-y-1`}>
                  <span className="rounded-full border-2 border-[#0284c7] bg-white px-3 py-1 text-[10px] font-black text-[#0284c7]">{item.name}</span>
                  {image ? (
                    <Image src={image} alt={`${item.name} cho thuê`} width={110} height={105} className="h-24 w-24 object-contain mix-blend-multiply" />
                  ) : (
                    <Camera className="size-16 text-[#0284c7]" />
                  )}
                  <span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 bg-[#7dd3fc]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-[1260px] gap-5 md:grid-cols-2">
        <div className="flex items-center gap-5 rounded-[30px] border-2 border-[#bae6fd] bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-[#e0f2fe] p-4 text-[#0284c7] shadow-sm">
            <ShieldCheck className="size-9" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-[#0284c7]">Cọc linh hoạt</p>
            <h2 className="mt-1 text-2xl font-black text-[#0c2340]">Tư vấn nhanh, rõ ràng</h2>
            <p className="mt-1 text-sm font-medium text-[#334e68]">Shop xác nhận theo thiết bị, giữ CCCD hoặc cọc tiền linh hoạt.</p>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-[30px] border-2 border-[#7dd3fc] bg-gradient-to-r from-[#e0f2fe] to-white p-6 shadow-sm">
          <div className="rounded-2xl bg-white p-4 text-[#0284c7] shadow-sm">
            <Store className="size-9" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-[#0284c7]">Điểm hẹn nhận máy chính thức</p>
            <h2 className="mt-1 text-2xl font-black text-[#0c2340]">ETown, Tân Bình, TP HCM</h2>
            <p className="mt-1 text-sm font-medium text-[#334e68]">Có thể nhận tại điểm hẹn ETown hoặc ship hỏa tốc 30 phút tận tay.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
