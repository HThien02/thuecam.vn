'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera, MapPin, ShieldCheck, Sparkles, Store } from 'lucide-react';

type HomeHeroProps = { image?: string };

const brands = [
  { name: 'SONY', slug: 'sony', className: 'bg-[#eef8f4] border-[#24443b] text-[#17352e]' },
  { name: 'CANON', slug: 'canon', className: 'bg-[#f2edff] border-[#24443b] text-[#17352e]' },
  { name: 'FUJI', slug: 'fujifilm', className: 'bg-[#eaf6ff] border-[#24443b] text-[#17352e]' },
  { name: 'POCKET', slug: 'pocket-camera', className: 'bg-[#fff0ae] border-[#24443b] text-[#17352e]' },
];

const gear = [
  { name: 'DJI', className: 'bg-[#eef8f4]' },
  { name: 'GO PRO', className: 'bg-[#f2edff]' },
  { name: 'INSTA360', className: 'bg-[#eaf6ff]' },
  { name: 'FUJIFILM', className: 'bg-[#fff4c8]' },
];

export default function HomeHero({ image }: HomeHeroProps) {
  return (
    <section className="bg-[#fbfaf4] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
      <div className="mx-auto grid max-w-[1260px] gap-5 lg:grid-cols-[0.95fr_1.35fr]">
        <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[38px] border-2 border-[#d6caff] bg-[#f2edff] p-7 shadow-[0_18px_50px_rgba(113,88,196,0.12)] sm:p-10 lg:min-h-[550px]">
          <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-[#d8f2e8]" />
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#fff0ae]" />
          <div className="relative">
            <span className="inline-flex -rotate-2 rounded-2xl bg-[#6d55c7] px-5 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(109,85,199,0.22)]">ƯU ĐÃI NHỎ XINH</span>
            <p className="mt-5 text-[84px] font-black leading-none tracking-[-0.08em] text-[#6d55c7] sm:text-[104px]">30<span className="text-[56px] align-top tracking-normal">%</span></p>
            <h2 className="max-w-sm text-2xl font-black leading-tight text-[#17352e] sm:text-3xl">Thuê lâu càng lời</h2>
            <p className="mt-3 max-w-sm text-base font-extrabold leading-7 text-[#36594f]">Giảm thêm cho lịch thuê cuối tuần<br />và nhóm bạn đi chơi cùng nhau.</p>
          </div>
          <div className="relative mt-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-[#17352e] shadow-[0_8px_25px_rgba(23,53,46,0.08)]"><Sparkles className="size-4 text-[#f09b45]" /> Chọn máy, shop lo phần còn lại</div>
            <Link href="/thue-camera-du-lich" className="block w-fit rounded-full bg-[#f09b45] px-7 py-4 text-sm font-black text-[#17352e] shadow-[0_10px_24px_rgba(240,155,69,0.25)] transition hover:-translate-y-0.5">Xem máy dễ thương</Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[38px] bg-[#dff3eb] p-7 sm:p-10 lg:min-h-[550px]">
          <div className="absolute -bottom-16 -right-14 size-72 rounded-full bg-[#cfc3ff] opacity-70" />
          <div className="absolute -left-16 top-24 size-48 rounded-full bg-[#fff0ae] opacity-80" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#fffdf5] px-4 py-2 text-sm font-black text-[#17352e] shadow-sm"><MapPin className="size-4 text-[#6d55c7]" /> Nhận máy nhanh tại TP.HCM</div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-[-0.04em] text-[#17352e] sm:text-6xl">Bấm máy thật vui<br />Lưu chuyến đi thật xinh</h1>
            <p className="mt-5 max-w-xl text-sm font-bold leading-6 text-[#527268] sm:text-base">Máy gọn, dễ dùng, phụ kiện đủ đầy cho mọi cuộc hẹn và chuyến đi.</p>
            <div className="mt-5 flex flex-wrap gap-2">{brands.map((brand) => <Link key={brand.slug} href={`/thuong-hieu/${brand.slug}`} className={`rounded-full border-2 px-4 py-1.5 text-xs font-black ${brand.className}`}>{brand.name}</Link>)}</div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gear.map((item, index) => <div key={`${item.name}-${index}`} className={`relative flex h-44 flex-col items-center justify-between rounded-t-[80px] rounded-b-xl border-2 border-[#b6a8f0] p-3 ${item.className}`}><span className="rounded-full border-2 border-[#24443b] bg-white px-3 py-1 text-[10px] font-black">{item.name}</span>{image ? <Image src={image} alt={`${item.name} cho thuê`} width={110} height={105} className="h-24 w-24 object-contain mix-blend-multiply" /> : <Camera className="size-16 text-[#24443b]" />}<span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 bg-[#b6a8f0]" /></div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-[1260px] gap-5 md:grid-cols-2">
        <div className="flex items-center gap-5 rounded-[30px] border-2 border-[#bfe8d5] bg-[#eef8f4] p-6"><div className="rounded-2xl bg-white p-4 text-[#438e72] shadow-sm"><ShieldCheck className="size-9" /></div><div><p className="text-xs font-black uppercase text-[#438e72]">Cọc linh hoạt</p><h2 className="mt-1 text-2xl font-black text-[#17352e]">Tư vấn nhanh, rõ ràng</h2><p className="mt-1 text-sm font-medium text-[#527268]">Shop xác nhận theo thiết bị, giấy tờ và lịch thuê.</p></div></div>
        <div className="flex items-center gap-5 rounded-[30px] border-2 border-[#d6caff] bg-[#f2edff] p-6"><div className="rounded-2xl bg-white p-4 text-[#6d55c7] shadow-sm"><Store className="size-9" /></div><div><p className="text-xs font-black uppercase text-[#6d55c7]">Điểm hẹn nhận máy</p><h2 className="mt-1 text-2xl font-black text-[#17352e]">ETown, Tân Bình, TP HCM</h2><p className="mt-1 text-sm font-medium text-[#527268]">Có thể nhận tại điểm hẹn hoặc ship tận tay.</p></div></div>
      </div>
    </section>
  );
}
