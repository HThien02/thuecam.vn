import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts, getClusterArticles } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import {
  JsonLdScript,
  generateProductRentalJsonLd,
} from '@/lib/seo/jsonld';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductClientActions from '@/components/product/ProductClientActions';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductCard, { formatVND } from '@/components/product/ProductCard';
import {
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Star,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return constructMetadata({
      title: 'Không Tìm Thấy Thiết Bị | THUECAM',
      noindex: true,
    });
  }

  const title =
    product.seo_title ||
    `Thuê ${product.name} Chính Hãng | Giá từ ${formatVND(product.rental_price_per_day)}/ngày | THUECAM`;
  const description =
    product.seo_description ||
    `Thuê ${product.name} với giá từ ${formatVND(product.rental_price_per_day)}/ngày. Kiểm tra lịch trống, đặt thuê online và thanh toán nhanh tại THUECAM.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/thiet-bi/${product.slug}`,
    ogImage: product.og_image || product.primary_image,
    noindex: !product.indexable,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  // Breadcrumbs
  const breadcrumbItems = [
    { name: 'Thiết bị', url: '/thiet-bi' },
    ...(product.category
      ? [{ name: product.category.name, url: `/danh-muc/${product.category.slug}` }]
      : []),
    { name: product.name, url: `/thiet-bi/${product.slug}` },
  ];

  // Schema JSON-LD
  const productJsonLd = generateProductRentalJsonLd(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Schema JSON-LD Injection */}
      <JsonLdScript data={productJsonLd} />

      {/* 2. Visual Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 3. Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Product images */}
        <div className="lg:col-span-7 space-y-4">
          <ProductImageGallery
            productName={product.name}
            images={[product.primary_image, ...(product.gallery_images ?? [])]}
          />

          {/* Verification Badge */}
          <div className="p-4 rounded-2xl bg-white border border-pink-100 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Thiết bị khử trùng, sạc đầy và test kỹ thuật 100% trước khi bàn giao</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">SKU: {product.sku}</span>
          </div>
        </div>

        {/* Right Column: Key Rental Information (100% Server Rendered HTML) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & H1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.brand && (
                <Link
                  href={`/thuong-hieu/${product.brand.slug}`}
                  className="badge-rental"
                >
                  {product.brand.name}
                </Link>
              )}
              {product.category && (
                <Link
                  href={`/danh-muc/${product.category.slug}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#FF3877] border border-pink-100"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            {/* Crucial SEO H1 */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              Thuê {product.name}
            </h1>

            {/* Ratings from verified reviews */}
            {product.rating && (
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  {product.review_count} lượt đánh giá thực tế từ khách thuê
                </span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {product.excerpt}
          </p>

          {/* Client Interactive Booking Actions */}
          <ProductClientActions product={product} />

          {/* Accessories Included */}
          {product.accessories_included && (
            <div className="p-5 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <PackageCheck className="w-4 h-4 text-[#FF3877]" />
                <span>Trọn Bộ Phụ Kiện Tặng Kèm Khi Thuê:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {product.accessories_included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 4. Specifications & Detailed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6 border-t border-pink-100">
        {/* Left: Long description & Guides */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF3877]" />
              Chi Tiết Thiết Bị & Lý Do Nên Thuê {product.name}
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-4 font-medium">
              {product.description}
            </div>
          </div>

          {/* Internal Linking: Topic Cluster & Related Articles */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50/70 to-white border border-pink-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF3877]" />
                Cẩm Nang & So Sánh Liên Quan Đến {product.name}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Link
                href="/so-sanh/dji-pocket-4-vs-pocket-3"
                className="p-3.5 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 flex flex-col justify-between group shadow-sm"
              >
                <span className="font-bold text-slate-900 group-hover:text-[#FF3877]">
                  So Sánh DJI Pocket 4 vs Pocket 3: Nên thuê máy nào?
                </span>
                <span className="text-[11px] text-[#FF3877] font-bold mt-2 flex items-center gap-1">
                  Đọc so sánh <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/huong-dan/dji-pocket-4-quay-du-lich"
                className="p-3.5 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 flex flex-col justify-between group shadow-sm"
              >
                <span className="font-bold text-slate-900 group-hover:text-[#FF3877]">
                  Hướng dẫn cài đặt DJI Pocket 4 quay du lịch sắc nét từ A-Z
                </span>
                <span className="text-[11px] text-[#FF3877] font-bold mt-2 flex items-center gap-1">
                  Xem hướng dẫn <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/thue-camera-du-lich"
                className="p-3.5 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 flex flex-col justify-between group shadow-sm"
              >
                <span className="font-bold text-slate-900 group-hover:text-[#FF3877]">
                  Pillar: Trọn bộ cẩm nang thuê camera du lịch
                </span>
                <span className="text-[11px] text-[#FF3877] font-bold mt-2 flex items-center gap-1">
                  Xem pillar page <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/nhu-cau/quay-vlog"
                className="p-3.5 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 flex flex-col justify-between group shadow-sm"
              >
                <span className="font-bold text-slate-900 group-hover:text-[#FF3877]">
                  Gói combo thiết bị chuyên dụng cho quay Vlog
                </span>
                <span className="text-[11px] text-[#FF3877] font-bold mt-2 flex items-center gap-1">
                  Xem gợi ý <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Genuine Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Đánh Giá Thực Tế Khách Đã Thuê {product.name}
              </h3>
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-3xl bg-white border border-pink-100 text-xs space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{rev.user_name}</span>
                        {rev.rental_verified && (
                          <span className="badge-verified text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Khách Thuê Thật
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{rev.created_at.split('T')[0]}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Technical Specifications Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-pink-100 pb-3">
              Thông Số Kỹ Thuật Chuẩn
            </h3>
            <div className="divide-y divide-pink-50 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">{key}:</span>
                  <span className="text-slate-900 font-bold text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal links: Categories & Brands */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50/50 to-white border border-pink-100 space-y-3 text-xs">
            <span className="text-slate-700 font-black block">Khám phá thêm:</span>
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <Link
                  href={`/danh-muc/${product.category.slug}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-slate-700 font-bold hover:bg-gradient-candy hover:text-white transition-all shadow-sm"
                >
                  {product.category.name}
                </Link>
              )}
              {product.brand && (
                <Link
                  href={`/thuong-hieu/${product.brand.slug}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-slate-700 font-bold hover:bg-gradient-candy hover:text-white transition-all shadow-sm"
                >
                  Hãng {product.brand.name}
                </Link>
              )}
              <Link
                href="/dia-diem/tphcm"
                className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-slate-700 font-bold hover:bg-gradient-candy hover:text-white transition-all shadow-sm"
              >
                Nhận máy tại TP.HCM
              </Link>
              <Link
                href="/dia-diem/ha-noi"
                className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-slate-700 font-bold hover:bg-gradient-candy hover:text-white transition-all shadow-sm"
              >
                Nhận máy tại Hà Nội
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-pink-100 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Thiết Bị Tương Đương Nên Xem 📸
            </h2>
            <Link
              href="/thiet-bi"
              className="text-xs text-[#FF3877] hover:text-[#e02462] font-black flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
