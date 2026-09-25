import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Aperture, Camera, SlidersHorizontal } from 'lucide-react';
import { getCameraFormulas } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Công Thức Setup Camera | THUECAM',
  description: 'Bộ sưu tập công thức cài đặt camera thực tế cho chụp ảnh và quay phim, kèm thông số thiết bị và hướng dẫn chi tiết.',
  canonicalPath: '/cong-thuc-setup',
});

export default async function CameraFormulaIndexPage() {
  const formulas = await getCameraFormulas();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
            <Aperture className="size-4" aria-hidden="true" /> THUECAM FIELD NOTES
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">Công thức setup camera</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">Công thức thực chiến do đội ngũ chia sẻ: xem ảnh mẫu, thông số máy và hướng dẫn để tái tạo màu sắc, ánh sáng cho từng bối cảnh.</p>
        </header>

        {formulas.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formulas.map((formula) => (
              <article key={formula.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-cyan-300/40 hover:bg-white/[0.07]">
                <Link href={`/cong-thuc-setup/${formula.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    {formula.featured_image && (
                      <Image src={formula.featured_image} alt={formula.title} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                      <Camera className="size-3.5" aria-hidden="true" /> Setup guide
                    </div>
                    <h2 className="text-lg font-bold leading-snug">{formula.title}</h2>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-400">{formula.excerpt}</p>
                    <span className="inline-flex items-center gap-2 pt-1 text-xs font-bold text-white">Xem công thức <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
                  </div>
                </Link>
                {!!formula.camera_settings?.length && (
                  <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-xs text-slate-400">
                    <SlidersHorizontal className="size-3.5 text-cyan-300" aria-hidden="true" /> {formula.camera_settings.length} thông số setup
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
            <Camera className="mx-auto size-9 text-cyan-300" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">Công thức mới đang được chuẩn bị</h2>
            <p className="mt-2 text-sm text-slate-400">Các bài setup camera sẽ xuất hiện tại đây sau khi được xuất bản.</p>
          </section>
        )}
      </div>
    </main>
  );
}
