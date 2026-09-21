import React from 'react';
import Link from 'next/link';
import { Product, FAQItem } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Sparkles, HelpCircle, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface CuratedLandingProps {
  slug: string;
  badge: string;
  h1: string;
  intro: string;
  detailedContent?: string;
  products: Product[];
  faq: FAQItem[];
  relatedLinks: { title: string; href: string }[];
}

export default function CuratedLandingTemplate({
  slug,
  badge,
  h1,
  intro,
  detailedContent,
  products,
  faq,
  relatedLinks,
}: CuratedLandingProps) {
  const breadcrumbs = [
    { name: 'Dịch vụ thuê', url: '/thiet-bi' },
    { name: h1, url: `/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & H1 */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {h1}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {intro}
        </p>

        <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> 100% Máy chính hãng kiểm định kỹ thuật
          </span>
          <span>•</span>
          <span>Tặng thẻ nhớ tốc độ cao</span>
          <span>•</span>
          <span>Giao nhanh 30 phút TP.HCM & Hà Nội</span>
        </div>
      </div>

      {/* Featured Curated Products */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Các Thiết Bị Đề Xuất Phù Hợp Nhất
          </h2>
          <Link
            href="/thiet-bi"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Tất cả thiết bị</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* In-depth Editorial Content */}
      {detailedContent && (
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="prose prose-invert max-w-none space-y-4 whitespace-pre-line">
            {detailedContent}
          </div>
        </div>
      )}

      {/* Topic Cluster & Internal Links */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          Bài Viết Chuyên Sâu & So Sánh Thuộc Chủ Đề
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {relatedLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between group transition-colors"
            >
              <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {item.title}
              </span>
              <span className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                Xem chi tiết <ArrowRight className="w-3 h-3 text-cyan-400" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      {faq.length > 0 && (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Câu Hỏi Thường Gặp Về Dịch Vụ
          </h2>
          <div className="space-y-4 text-xs">
            {faq.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
              >
                <h3 className="font-bold text-white text-sm">{item.question}</h3>
                <p className="text-slate-400 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
