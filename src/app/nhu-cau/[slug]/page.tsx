import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUseCaseBySlug, getUseCases, getProducts } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { constructMetadata } from '@/lib/seo/metadata';
import { Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);

  if (!useCase) {
    return constructMetadata({
      title: 'Không Tìm Thấy Nhu Cầu | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: useCase.seo_title || `${useCase.name} | Gợi Ý Thiết Bị Phù Hợp | THUECAM`,
    description: useCase.seo_description || useCase.content,
    canonicalPath: `/nhu-cau/${useCase.slug}`,
    ogImage: useCase.og_image,
    noindex: !useCase.indexable,
  });
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);

  if (!useCase) {
    notFound();
  }

  const allProducts = await getProducts();
  const allUseCases = await getUseCases();

  // Pick suitable products depending on use case
  const recommendedProducts = allProducts.slice(0, 4);

  const breadcrumbItems = [
    { name: 'Nhu cầu', url: '/thiet-bi' },
    { name: useCase.name, url: `/nhu-cau/${useCase.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header & H1 */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Giải pháp thiết bị theo nhu cầu thực tế</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
          {useCase.h1}
        </h1>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {useCase.content}
        </p>

        {/* Other use-cases */}
        <div className="flex flex-wrap gap-2 pt-2">
          {allUseCases.map((uc) => (
            <Link
              key={uc.id}
              href={`/nhu-cau/${uc.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${uc.slug === useCase.slug
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {uc.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-black">
          Combo Thiết Bị Tối Ưu Nhất Cho {useCase.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* FAQ for this use case */}
      {useCase.faq && useCase.faq.length > 0 && (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Câu Hỏi Thường Gặp Về {useCase.name}
          </h2>
          <div className="space-y-4 text-xs">
            {useCase.faq.map((item, i) => (
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
