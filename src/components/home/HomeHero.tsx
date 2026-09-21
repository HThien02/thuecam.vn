'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock3, Home, MapPin, Phone, Tag, Wrench } from 'lucide-react';

type HomeHeroProps = { image?: string };

const brands = [
  { name: 'Sony', slug: 'sony', className: 'bg-[#eef2ff] border-[#c7d2fe] text-[#3730a3]' },
  { name: 'Canon', slug: 'canon', className: 'bg-[#fff1f2] border-[#fecdd3] text-[#be123c]' },
  { name: 'Fuji', slug: 'fujifilm', className: 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]' },
  { name: 'Pocket', slug: 'pocket-camera', className: 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]' },
];

export default function HomeHero({ image }: HomeHeroProps) {
  return (
    <section className="bg-[#fff9fa] px-4 pb-14 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto grid max-w-7xl items-stretch gap-5 lg:grid-cols-10">
        <div className="relative min-h-[300px] overflow-hidden rounded-[15px] bg-slate-200 lg:col-span-4 lg:min-h-[510px]">
          {image ? <Image src={image} alt="Máy ảnh cho thuê tại THUECAM" fill className="object-cover" priority /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-800 backdrop-blur">Máy xịn, sẵn sàng cho chuyến đi</span>
        </div>

        <div className="flex flex-col justify-center rounded-[15px] border border-pink-100 bg-white p-6 shadow-cute sm:p-10 lg:col-span-6">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-black text-[#d92d68]"><MapPin className="size-3.5" /> Tân Sơn, Hồ Chí Minh</div>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">Có máy khi cần,<br /><span className="text-gradient">có shot khi muốn</span></h1>
          <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-600 sm:text-base">Ship tận tay TP HCM, kèm hướng dẫn sử dụng khi giao máy. Chọn thiết bị phù hợp và bắt đầu tạo những khung hình đáng nhớ.</p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-black text-slate-900">Ưu đãi cộng dồn đến <strong className="text-2xl text-[#d92d68]">40%</strong></p>
            <p className="mt-1 text-xs font-bold text-slate-600">First bill -20% theo CCCD <span className="text-[#d92d68]">|</span> Thứ 6 hằng tuần -10%</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {brands.map((brand) => <Link key={brand.slug} href={`/thuong-hieu/${brand.slug}`} className={`rounded-full border px-3 py-1.5 text-xs font-black ${brand.className}`}>{brand.name}</Link>)}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/thue-camera-du-lich" className="inline-flex items-center gap-2 rounded-full bg-gradient-candy px-6 py-3.5 text-sm font-black text-white shadow-cute transition hover:opacity-90">Đặt thuê ngay <ArrowRight className="size-4" /></Link>
            <a href="tel:0932501411" className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-3.5 text-sm font-black text-[#d92d68] hover:bg-pink-50"><Phone className="size-4" /> 0932501411</a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-4">
        <Link href="/" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700"><Home className="size-4 text-[#d92d68]" /> Trang chủ</Link>
        <Link href="/bang-gia" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700"><Tag className="size-4 text-[#d92d68]" /> Bảng giá</Link>
        <Link href="/thue-theo-gio" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700"><Clock3 className="size-4 text-[#d92d68]" /> Theo giờ</Link>
        <Link href="/cong-thuc-setup" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700"><Wrench className="size-4 text-[#d92d68]" /> Công thức setup</Link>
      </div>
    </section>
  );
}
