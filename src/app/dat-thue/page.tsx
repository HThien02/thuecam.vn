import type { Metadata } from 'next';
import { getBookingProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import RentalRequestForm from '@/components/booking/RentalRequestForm';
import { Sparkles, MapPin } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Đặt Thuê Thiết Bị & Kiểm Tra Lịch Máy Trống | THUECAM',
  description:
    'Kiểm tra lịch máy còn trống và gửi thông tin đặt thuê trực tuyến. Nhận máy tại ETown Tân Bình hoặc giao hỏa tốc 30 phút.',
  canonicalPath: '/dat-thue',
});

export default async function RentalPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; duration?: string }>;
}) {
  const [products, params] = await Promise.all([getBookingProducts(), searchParams]);
  const initialProduct = products.find((product) => product.slug === params.product);

  return (
    <main className="min-h-screen bg-[#f0f7ff] px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-4 py-1 text-xs font-black uppercase text-[#0284c7] border border-sky-200">
            <Sparkles className="size-3.5" /> Đặt thuê online nhanh chóng
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Lịch Máy Còn Trống & Đặt Thuê
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
            Xem ngay bảng lịch thiết bị còn trống bên dưới. Không cần tạo tài khoản rườm rà. Chọn ngày nhận & trả, THUECAM sẽ chuẩn bị máy kèm phụ kiện đầy đủ cho bạn!
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-sky-800">
            <MapPin className="size-4 text-[#0284c7]" />
            <span>Điểm nhận máy: <strong>ETown, Tân Bình, TP HCM</strong> (hoặc ship tận tay)</span>
          </div>
        </div>

        <RentalRequestForm products={products} initialProduct={initialProduct} />
      </div>
    </main>
  );
}
