import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlug, getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import { JsonLdScript, generateArticleJsonLd } from '@/lib/seo/jsonld';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { Scale, Sparkles, ArrowRight, User, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== 'comparison') {
    return constructMetadata({
      title: 'Không Tìm Thấy Bài So Sánh | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: article.seo_title || `${article.title} | THUECAM`,
    description: article.seo_description || article.excerpt,
    canonicalPath: `/so-sanh/${article.slug}`,
    ogImage: article.og_image || article.featured_image,
  });
}

export default async function ComparisonDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== 'comparison') {
    notFound();
  }

  const allProducts = await getProducts();
  const comparedProducts = allProducts.filter((p) =>
    article.related_product_ids?.includes(p.id)
  );

  const breadcrumbItems = [
    { name: 'Cẩm nang', url: '/blog' },
    { name: 'So sánh thiết bị', url: '/so-sanh/dji-pocket-4-vs-pocket-3' },
    { name: article.title, url: `/so-sanh/${article.slug}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <JsonLdScript data={generateArticleJsonLd(article)} />
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>So Sánh Trực Diện & Tư Vấn Chọn Thuê</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {article.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-cyan-400 pl-4">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
          <span>Người viết: {article.author_name}</span>
          <span>•</span>
          <span>Cập nhật: {article.updated_at.split('T')[0]}</span>
        </div>
      </div>

      {/* Compared Products Grid */}
      {comparedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">2 Thiết Bị Đang Được So Sánh</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {comparedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Content & Comparison Matrix */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="prose prose-invert max-w-none space-y-4 whitespace-pre-line">
          {article.content}
        </div>
      </div>

      {/* Related links */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs">
        <span className="font-bold text-white uppercase tracking-wider block">
          Bài viết liên quan:
        </span>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/thue-camera-du-lich"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors"
          >
            Pillar: Thuê camera du lịch
          </Link>
          <Link
            href="/huong-dan/dji-pocket-4-quay-du-lich"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors"
          >
            Hướng dẫn cài đặt DJI Pocket 4
          </Link>
        </div>
      </div>
    </div>
  );
}
