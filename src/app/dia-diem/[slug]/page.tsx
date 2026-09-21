import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocationBySlug, getLocations, getProducts } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { constructMetadata } from '@/lib/seo/metadata';
import { JsonLdScript, generateLocalBusinessJsonLd } from '@/lib/seo/jsonld';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, Navigation } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    return constructMetadata({
      title: 'Không Tìm Thấy Chi Nhánh | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: location.seo_title || `Thuê Camera Tại ${location.name} | Giao Ngay 30 Phút | THUECAM`,
    description: location.seo_description || location.intro_content,
    canonicalPath: `/dia-diem/${location.slug}`,
    noindex: !location.indexable,
  });
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const products = await getProducts();
  const allLocations = await getLocations();
  const locationJsonLd = generateLocalBusinessJsonLd(location);

  const breadcrumbItems = [
    { name: 'Chi nhánh', url: '/dia-diem/tphcm' },
    { name: location.name, url: `/dia-diem/${location.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Schema JSON-LD LocalBusiness */}
      <JsonLdScript data={locationJsonLd} />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header & Local Business Profile */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="space-y-3">
          <span className="badge-verified">Chi Nhánh & Showroom Thực Tế</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Thuê Camera & Thiết Bị Quay Phim Tại {location.name}
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {location.intro_content}
          </p>
        </div>

        {/* Store details card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Địa chỉ Showroom:
            </span>
            <p className="font-semibold text-white">{location.address}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Hotline hỗ trợ:
            </span>
            <p className="font-semibold text-cyan-400">{location.phone}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Email tiếp nhận:
            </span>
            <p className="font-semibold text-white">{location.email}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Giờ phục vụ:
            </span>
            <p className="font-semibold text-white">08:00 - 21:30 hàng ngày</p>
          </div>
        </div>

        {/* Other Real Service Locations */}
        <div className="flex items-center gap-2 pt-2 text-xs">
          <span className="text-slate-400">Xem chi nhánh khác:</span>
          {allLocations.map((loc) => (
            <Link
              key={loc.id}
              href={`/dia-diem/${loc.slug}`}
              className={`px-3 py-1 rounded-lg transition-colors ${
                loc.slug === location.slug
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {loc.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Available Equipment at this location */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">
          Thiết Bị Sẵn Sàng Bàn Giao Hỏa Tốc Tại {location.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
