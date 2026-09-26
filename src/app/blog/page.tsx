import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/data';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { constructMetadata } from '@/lib/seo/metadata';
import { BookOpen, Sparkles, ArrowRight, User, Calendar } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Cẩm Nang & Kinh Nghiệm Thuê Camera | Đánh Giá Thiết Bị | THUECAM',
  description:
    'Chia sẻ kinh nghiệm thuê camera du lịch, hướng dẫn sử dụng DJI Pocket 4, so sánh thiết bị, mẹo quay video TikTok, Vlog chuẩn đẹp từ các chuyên gia kỹ thuật.',
  canonicalPath: '/blog',
});

export default async function BlogIndexPage() {
  const articles = await getArticles();

  const categories = [
    'Tất cả',
    'Camera Guides',
    'Camera Reviews',
    'Rental Guides',
    'Travel',
    'Vlogging',
    'TikTok',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ name: 'Cẩm nang & Blog', url: '/blog' }]} />

      {/* Header & H1 */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kiến thức & Kinh nghiệm thực chiến</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight">
          Cẩm Nang Thuê Máy & Kỹ Thuật Quay Chụp
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Nơi đội ngũ kỹ thuật THUECAM chia sẻ hướng dẫn thực tế, so sánh trực diện và kinh nghiệm tối ưu thiết bị quay chụp cho các vlogger, travel blogger và nhà sáng tạo nội dung.
        </p>

        {/* Categories tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((c, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                i === 0
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => {
          let href = `/blog/${art.slug}`;
          if (art.type === 'guide') href = `/huong-dan/${art.slug}`;
          if (art.type === 'comparison') href = `/so-sanh/${art.slug}`;
          if (art.type === 'landing') href = `/${art.slug}`;

          return (
            <article
              key={art.id}
              className="group glass-panel rounded-2xl overflow-hidden border border-slate-800 card-hover flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                <Image
                  src={art.featured_image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-cyan-400 backdrop-blur-md border border-white/10">
                  {art.type === 'comparison'
                    ? 'So Sánh'
                    : art.type === 'guide'
                    ? 'Hướng Dẫn'
                    : 'Bài Viết'}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-black group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                    <Link href={href}>{art.title}</Link>
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {art.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {art.published_at.split('T')[0]}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
