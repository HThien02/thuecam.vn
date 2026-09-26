'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  productName: string;
  images: string[];
}

export default function ProductImageGallery({ productName, images }: ProductImageGalleryProps) {
  const uniqueImages = Array.from(new Set(images.filter(Boolean)));
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = uniqueImages[activeIndex];

  if (!activeImage) return null;

  const showControls = uniqueImages.length > 1;
  const showIndex = (index: number) => {
    setActiveIndex((index + uniqueImages.length) % uniqueImages.length);
  };

  return (
    <section aria-label={`Thư viện ảnh ${productName}`}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm"
        aria-roledescription="carousel"
        aria-label={`${productName}, ảnh ${activeIndex + 1} trên ${uniqueImages.length}`}
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${productName}${showControls ? `, ảnh ${activeIndex + 1}` : ''}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
        />

        {showControls && (
          <>
            <button
              type="button"
              onClick={() => showIndex(activeIndex - 1)}
              aria-label="Xem ảnh trước"
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-sky-100 bg-white/95 text-slate-800 shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => showIndex(activeIndex + 1)}
              aria-label="Xem ảnh tiếp theo"
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-sky-100 bg-white/95 text-slate-800 shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <span
              className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-white"
              aria-live="polite"
              aria-atomic="true"
            >
              {activeIndex + 1} / {uniqueImages.length}
            </span>
          </>
        )}
      </div>

      {showControls && (
        <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2" aria-label="Chọn ảnh sản phẩm">
          {uniqueImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Xem ảnh ${index + 1} của ${productName}`}
              aria-pressed={index === activeIndex}
              className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-sky-50 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                index === activeIndex ? 'border-sky-500' : 'border-sky-100 hover:border-sky-300'
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
