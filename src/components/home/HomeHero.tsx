'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ShieldCheck, Store, Star } from 'lucide-react';

const brands = [
  { name: 'SONY', slug: 'sony', className: 'bg-[#e0f2fe] border-[#0284c7] text-[#0c2340]' },
  { name: 'CANON', slug: 'canon', className: 'bg-[#f0f9ff] border-[#0284c7] text-[#0c2340]' },
  { name: 'FUJI', slug: 'fujifilm', className: 'bg-[#e0f2fe] border-[#0284c7] text-[#0c2340]' },
  { name: 'POCKET', slug: 'pocket-camera', className: 'bg-[#fef9c3] border-[#ca8a04] text-[#713f12]' },
];

export default function HomeHero() {
  return (
    <section className="bg-[#f0f7ff] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
      <div className="mx-auto max-w-[1260px]">
        <div className="relative isolate overflow-hidden rounded-[38px] border-2 border-[#bae6fd] bg-gradient-to-br from-[#e5f8ff] via-[#f8fdff] to-[#fffdf2] p-7 shadow-[0_18px_50px_rgba(2,132,199,0.1)] sm:p-10 lg:min-h-[550px]">
          <div className="absolute -bottom-20 -right-10 size-80 rounded-full bg-[#bae6fd]/50" />
          <div className="absolute -left-16 top-28 size-48 rounded-full bg-[#fef9c3]/65" />
          <div className="absolute right-9 top-20 size-3 rotate-12 rounded-sm bg-[#fb923c]" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-full border border-[#bae6fd] bg-white px-4 py-2 text-sm font-black text-[#0c2340] shadow-[0_6px_0_rgba(186,230,253,0.7)]">
              <MapPin className="size-4 text-[#0284c7]" /> Nhận máy nhanh tại ETown Tân Bình
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-[-0.04em] text-[#0c2340] sm:text-5xl">
              Bấm máy thật vui<br />Lưu chuyến đi thật xinh
            </h1>
            <p className="mt-4 max-w-xl text-sm font-bold leading-6 text-[#334e68] sm:text-base">
              Máy gọn, dễ dùng, phụ kiện đủ đầy cho mọi cuộc hẹn và chuyến đi khám phá.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {brands.map((brand, index) => (
                <Link key={brand.slug} href={`/thuong-hieu/${brand.slug}`} className={`rounded-full border-2 px-4 py-1.5 text-xs font-black shadow-sm transition hover:-translate-y-0.5 ${index % 2 === 0 ? '-rotate-2' : 'rotate-2'} ${brand.className}`}>
                  {brand.name}
                </Link>
              ))}
            </div>
            <div className="relative mx-auto mt-3 flex min-h-[270px] max-w-[620px] items-center justify-center sm:min-h-[320px]">
              <div className="absolute bottom-5 left-[12%] size-40 rounded-full bg-white/80 blur-2xl" />
              <Image
                src="/images/home-hero-chibi.png"
                alt="Bốn linh vật máy ảnh chibi nhiều màu sắc, vui nhộn"
                width={1400}
                height={1024}
                priority
                sizes="(max-width: 1024px) 90vw, 620px"
                className="relative z-10 h-[280px] w-full max-w-[620px] -rotate-2 object-contain drop-shadow-[0_18px_16px_rgba(12,35,64,0.16)] transition-transform duration-500 hover:rotate-2 hover:scale-[1.03] sm:h-[350px]"
              />
              <div className="absolute left-0 top-8 z-20 flex -rotate-12 items-center gap-1 rounded-2xl border-2 border-[#bae6fd] bg-white px-3 py-2 text-[11px] font-black text-[#0284c7] shadow-[0_5px_0_rgba(125,211,252,0.6)] sm:left-2">
                <Star className="size-3 fill-[#facc15] text-[#facc15]" /> Mang cả team đi chơi!
              </div>
              <div className="absolute bottom-3 right-1 z-20 rotate-6 rounded-full border-2 border-white bg-[#fef08a] px-3 py-2 text-[10px] font-black text-[#713f12] shadow-[0_5px_0_rgba(202,138,4,0.25)] sm:right-5">
                CHỤP VUI · ĐI CHILL
              </div>
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
