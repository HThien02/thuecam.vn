import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getCategories, getProductsByCategory, getBrands } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { constructMetadata } from '@/lib/seo/metadata';
import { Sparkles, Layers, ArrowRight, HelpCircle } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return constructMetadata({
      title: 'Không Tìm Thấy Danh Mục | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: category.seo_title || `${category.name} Cho Thuê Chính Hãng | THUECAM`,
    description: category.seo_description || category.intro_content,
    canonicalPath: `/danh-muc/${category.slug}`,
    ogImage: category.og_image,
    noindex: !category.indexable,
  });
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.slug);
  const allCategories = await getCategories();
  const brands = await getBrands();

  const breadcrumbItems = [
    { name: 'Thiết bị', url: '/thiet-bi' },
    { name: category.name, url: `/danh-muc/${category.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header & H1 */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Danh mục thiết bị chuyên dụng</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
          {category.h1}
        </h1>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {category.intro_content}
        </p>

        {/* Other categories navigation */}
        <div className="flex flex-wrap gap-2 pt-2">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${cat.slug === category.slug
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">
            Các Thiết Bị Thuộc Nhóm {category.name} ({products.length} máy)
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            Hiện tại các máy thuộc nhóm này đang được bảo dưỡng định kỳ. Vui lòng liên hệ hotline 0932.501.411 để nhận tư vấn máy tương đương.
          </div>
        )}
      </div>

      {/* Internal linking & Brands */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Khám phá theo thương hiệu hàng đầu:
        </span>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/thuong-hieu/${brand.slug}`}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-600 text-xs transition-colors"
            >
              Máy quay {brand.name}
            </Link>
          ))}
          <Link
            href="/thue-camera-du-lich"
            className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold"
          >
            Xem Cẩm Nang Du Lịch (Pillar)
          </Link>
        </div>
      </div>
    </div>
  );
}
