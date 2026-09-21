import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlug, getProducts, getClusterArticles } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import { JsonLdScript, generateArticleJsonLd } from '@/lib/seo/jsonld';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { User, Calendar, Clock, CheckCircle2, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return constructMetadata({
      title: 'Không Tìm Thấy Bài Viết | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: article.seo_title || `${article.title} | THUECAM`,
    description: article.seo_description || article.excerpt,
    canonicalPath: `/blog/${article.slug}`,
    ogImage: article.og_image || article.featured_image,
    type: 'article',
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    authors: [article.author_name],
    noindex: !article.indexable,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = generateArticleJsonLd(article);
  const clusterArticles = article.pillar_slug
    ? await getClusterArticles(article.pillar_slug)
    : [];

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) =>
    article.related_product_ids?.includes(p.id)
  );

  const breadcrumbItems = [
    { name: 'Cẩm nang', url: '/blog' },
    { name: article.title, url: `/blog/${article.slug}` },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <JsonLdScript data={articleJsonLd} />
      <Breadcrumbs items={breadcrumbItems} />

      {/* Article Header */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2">
          <span className="badge-rental">Chuyên Mục Kỹ Thuật</span>
          {article.pillar_slug && (
            <Link
              href={`/${article.pillar_slug}`}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Thuộc Topic Cluster Du Lịch</span>
            </Link>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic border-l-2 border-cyan-400 pl-4">
          {article.excerpt}
        </p>

        {/* Author metadata & Trust indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            {article.author_avatar ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40">
                <Image
                  src={article.author_avatar}
                  alt={article.author_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-bold text-white block">{article.author_name}</span>
              <span className="text-[11px] text-slate-400">Kỹ thuật viên kiểm định THUECAM</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Đăng ngày: {article.published_at.split('T')[0]}
            </span>
            {article.reviewer_name && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kiểm duyệt: {article.reviewer_name}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Featured Banner */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
        <Image
          src={article.featured_image}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line">
        {article.content}
      </div>

      {/* Recommended Products CTA Box */}
      {relatedProducts.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="badge-rental mb-1">Thiết bị được nhắc đến trong bài</span>
              <h3 className="text-base font-bold text-white">
                Thuê Trải Nghiệm Máy Thực Tế
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Author Bio Box */}
      {article.author_bio && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-4 text-xs">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white">Về tác giả: {article.author_name}</span>
            <p className="text-slate-400 leading-relaxed">{article.author_bio}</p>
          </div>
        </div>
      )}

      {/* Topic Cluster: Pillar & Related Articles */}
      {clusterArticles.length > 0 && (
        <div className="pt-8 border-t border-white/5 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Các Bài Viết Cùng Cụm Chủ Đề Du Lịch
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/thue-camera-du-lich"
              className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 flex flex-col justify-between group"
            >
              <span className="font-bold text-cyan-300 group-hover:text-white">
                ★ Pillar Page: Dịch vụ thuê camera du lịch trọn gói
              </span>
              <span className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                Xem cẩm nang tổng hợp <ArrowRight className="w-3 h-3 text-cyan-400" />
              </span>
            </Link>

            {clusterArticles
              .filter((a) => a.id !== article.id)
              .slice(0, 3)
              .map((cArt) => (
                <Link
                  key={cArt.id}
                  href={`/blog/${cArt.slug}`}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between group"
                >
                  <span className="font-semibold text-white group-hover:text-cyan-400">
                    {cArt.title}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-2">
                    {cArt.published_at.split('T')[0]}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </article>
  );
}
