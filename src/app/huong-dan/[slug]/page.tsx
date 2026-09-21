import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import { JsonLdScript, generateArticleJsonLd } from '@/lib/seo/jsonld';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { Sparkles, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== 'guide') {
    return constructMetadata({
      title: 'Không Tìm Thấy Hướng Dẫn | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: article.seo_title || `${article.title} | THUECAM`,
    description: article.seo_description || article.excerpt,
    canonicalPath: `/huong-dan/${article.slug}`,
    ogImage: article.og_image || article.featured_image,
  });
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.type !== 'guide') {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) =>
    article.related_product_ids?.includes(p.id)
  );

  const breadcrumbItems = [
    { name: 'Cẩm nang', url: '/blog' },
    { name: 'Hướng dẫn kỹ thuật', url: '/huong-dan/dji-pocket-4-quay-du-lich' },
    { name: article.title, url: `/huong-dan/${article.slug}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <JsonLdScript data={generateArticleJsonLd(article)} />
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cẩm Nang Hướng Dẫn Kỹ Thuật</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {article.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-cyan-400 pl-4">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
          <span>Kỹ thuật viên: {article.author_name}</span>
          <span>•</span>
          <span>Cập nhật: {article.updated_at.split('T')[0]}</span>
        </div>
      </div>

      {/* Guide Content */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="prose prose-invert max-w-none space-y-4 whitespace-pre-line">
          {article.content}
        </div>
      </div>

      {/* Recommended Device */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Thiết Bị Dùng Trong Bài Hướng Dẫn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
