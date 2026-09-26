'use client';

import { useId, useRef } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

export default function AccessoryImagePreview({ src, alt }: { src: string; alt: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const closeDialog = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label={`Xem ảnh rõ hơn: ${alt}`}
        onClick={() => dialogRef.current?.showModal()}
        className="group relative size-12 shrink-0 overflow-hidden rounded-lg border border-sky-100 bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <Image src={src} alt="" fill sizes="48px" className="object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-slate-950/0 text-white transition-colors group-hover:bg-slate-950/45 group-focus-visible:bg-slate-950/45">
          <ZoomIn aria-hidden="true" className="size-5 drop-shadow" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="m-auto max-h-[94dvh] max-w-[96vw] overflow-visible border-0 bg-transparent p-0 backdrop:bg-slate-950/85"
      >
        <div className="max-h-[94dvh] max-w-[96vw] overflow-hidden rounded-2xl bg-white p-3 shadow-2xl sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id={titleId} className="min-w-0 truncate text-sm font-bold text-slate-900 sm:text-base">
              {alt}
            </h2>
            <button
              type="button"
              autoFocus
              aria-label="Đóng ảnh phóng to"
              onClick={closeDialog}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={1200}
            sizes="(max-width: 768px) 92vw, 1100px"
            className="mx-auto block h-auto max-h-[78dvh] w-auto max-w-[92vw] rounded-lg object-contain"
          />
          <p className="mt-2 text-center text-xs text-slate-500">Nhấn Esc hoặc chạm ra ngoài để đóng</p>
        </div>
      </dialog>
    </>
  );
}
