import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import RentalRequestForm from '@/components/booking/RentalRequestForm';

export const metadata: Metadata = constructMetadata({ title: 'Đặt thuê thiết bị | THUECAM', description: 'Gửi thông tin để THUECAM xác nhận lịch thuê thiết bị.', canonicalPath: '/dat-thue' });

export default async function RentalPage({ searchParams }: { searchParams: Promise<{ product?: string; duration?: string }> }) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  const activeProducts = products.filter((product) => product.status === 'ACTIVE');
  const initialProduct = activeProducts.find((product) => product.slug === params.product);

  return <main className="min-h-screen bg-[#fffaf7] px-4 py-12 text-slate-900 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><div className="mb-8 text-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b9a]">Đặt thuê online</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Gửi thông tin thuê thiết bị</h1><p className="mx-auto mt-4 max-w-2xl text-slate-600">Không cần tạo tài khoản. Điền nhanh thông tin, shop sẽ xác nhận lịch và mức giá phù hợp qua tin nhắn.</p></div><RentalRequestForm products={activeProducts} initialProduct={initialProduct} /></div></main>;
}
