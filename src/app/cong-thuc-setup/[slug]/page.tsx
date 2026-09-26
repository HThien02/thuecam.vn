import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Camera, SlidersHorizontal } from 'lucide-react';
import { getCameraFormulaBySlug } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formula = await getCameraFormulaBySlug(slug);
  if (!formula) return constructMetadata({ title: 'Không tìm thấy công thức | THUECAM', noindex: true });
  return constructMetadata({
    title: formula.seo_title || `${formula.title} | Công thức setup camera THUECAM`,
    description: formula.seo_description || formula.excerpt,
    canonicalPath: `/cong-thuc-setup/${formula.slug}`,
    ogImage: formula.og_image || formula.featured_image,
    type: 'article',
    publishedTime: formula.published_at,
    modifiedTime: formula.updated_at,
    authors: [formula.author_name],
  });
}

export default async function CameraFormulaDetailPage({ params }: Props) {
  const { slug } = await params;
  const formula = await getCameraFormulaBySlug(slug);
  if (!formula) notFound();
  const images = formula.gallery_images?.length ? formula.gallery_images : [formula.featured_image];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl space-y-8">
        <Link href="/cong-thuc-setup" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-cyan-300">
          <ArrowLeft className="size-4" aria-hidden="true" /> Tất cả công thức
        </Link>
        <header className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
            <Camera className="size-4" aria-hidden="true" /> CAMERA SETUP
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{formula.title}</h1>
          {formula.excerpt && <p className="max-w-3xl text-base leading-7 text-slate-600">{formula.excerpt}</p>}
          <p className="text-xs text-slate-500">Chia sẻ bởi {formula.author_name} · {formula.published_at.slice(0, 10)}</p>
        </header>

        {formula.featured_image && (
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
            <Image src={formula.featured_image} alt={formula.title} fill unoptimized priority sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" />
          </div>
        )}

        {!!formula.camera_settings?.length && (
          <section className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5 sm:p-7" aria-labelledby="settings-heading">
            <h2 id="settings-heading" className="flex items-center gap-2 text-lg font-bold"><SlidersHorizontal className="size-5 text-cyan-300" aria-hidden="true" /> Thông số công thức</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {formula.camera_settings.filter((setting) => setting.label || setting.value).map((setting, index) => (
                <div key={`${setting.label}-${index}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <dt className="text-sm text-slate-400">{setting.label}</dt>
                  <dd className="text-right text-sm font-bold text-white">{setting.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="whitespace-pre-line text-sm leading-8 text-slate-200 sm:text-base">{formula.content}</div>

        {images.length > 1 && (
          <section className="space-y-3" aria-label="Ảnh minh họa công thức">
            <h2 className="text-lg font-bold">Ảnh minh họa</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {images.map((image, index) => (
                <div key={`${index}-${image.slice(0, 32)}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                  <Image src={image} alt={`${formula.title} — ảnh ${index + 1}`} fill unoptimized sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
