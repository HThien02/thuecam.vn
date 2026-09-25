import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getProducts,
  getCategories,
  getUseCases,
  getApprovedReviews,
  getArticles,
} from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import HomeHero from '@/components/home/HomeHero';
import {
  Camera,
  ArrowRight,
  HelpCircle,
  Star,
  Flame,
} from 'lucide-react';

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const useCases = await getUseCases();
  const reviews = await getApprovedReviews();
  const recentArticles = await getArticles();

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-[#f0f7ff]/40">
      {/* 1. HOMEPAGE HERO WITH ORIGINAL CHIBI CAMERA MASCOTS */}
      <HomeHero />

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider block">
              Danh Mục Thiết Bị
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Tìm Thiết Bị Đúng Gu Của Bạn 📸✨
            </h2>
          </div>
          <Link
            href="/thiet-bi"
            className="text-xs text-[#0284c7] hover:text-[#0369a1] font-black flex items-center gap-1"
          >
            <span>Xem tất cả ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="p-4 rounded-[28px] bg-white border-2 border-sky-100 hover:border-sky-300 card-hover text-center flex flex-col items-center group shadow-cute"
            >
              <div className="w-13 h-13 rounded-2xl bg-sky-50 group-hover:bg-gradient-candy group-hover:text-white flex items-center justify-center text-[#0284c7] mb-3 transition-colors shadow-inner">
                <Camera className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-900 group-hover:text-[#0284c7] transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Giá từ 100K/ngày</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Sản Phẩm Đang Cho Thuê Nhiều Nhất
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Top Máy Sẵn Kho Nhận Ngay Hôm Nay 🚀
            </h2>
          </div>
          <Link
            href="/thiet-bi"
            className="text-xs text-[#0284c7] hover:text-[#0369a1] font-black flex items-center gap-1"
          >
            <span>Xem thêm máy khác</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. USE CASES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-[34px] bg-gradient-to-br from-sky-50 via-white to-blue-50 border-2 border-sky-100 shadow-cute">
          <div className="max-w-2xl mb-8">
            <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider block">
              Gợi Ý Theo Mục Đích Sử Dụng
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Bạn Cần Máy Để Đi Đâu, Quay Gì? 🏖️
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Đội ngũ kỹ thuật THUECAM đã cấu hình sẵn combo máy, thẻ nhớ và phụ kiện chuyên biệt cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {useCases.map((uc) => (
              <Link
                key={uc.id}
                href={`/nhu-cau/${uc.slug}`}
                className="p-6 rounded-[28px] bg-white border border-sky-100 hover:border-sky-300 card-hover flex flex-col justify-between group shadow-sm hover:shadow-cute"
              >
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#0284c7] transition-colors">
                    {uc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {uc.content}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-black text-[#0284c7] group-hover:translate-x-1 transition-transform">
                  <span>Xem combo máy phù hợp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider block">
            Thủ Tục Siêu Nhanh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Thuê Máy Dễ Dàng Chỉ Với 3 Bước Đơn Giản ✨
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-7 rounded-[28px] bg-white border-2 border-sky-100 text-center space-y-3 shadow-cute card-hover">
            <div className="w-13 h-13 rounded-2xl bg-gradient-candy text-white font-black text-lg flex items-center justify-center mx-auto shadow-cute">
              1
            </div>
            <h3 className="font-black text-slate-900 text-base">Chọn Máy & Xem Lịch Trống</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kiểm tra trực tiếp lịch trống của máy online, chọn số ngày cần thuê từ 1 ngày đến dài hạn.
            </p>
          </div>

          <div className="p-7 rounded-[28px] bg-white border-2 border-sky-100 text-center space-y-3 shadow-cute card-hover">
            <div className="w-13 h-13 rounded-2xl bg-gradient-candy text-white font-black text-lg flex items-center justify-center mx-auto shadow-cute">
              2
            </div>
            <h3 className="font-black text-slate-900 text-base">Liên hệ & Cọc Linh Hoạt</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Liên hệ shop để được tư vấn nhanh. Hỗ trợ cọc bằng CCCD gắn chip hoặc cọc tiền linh hoạt theo thiết bị.
            </p>
          </div>

          <div className="p-7 rounded-[28px] bg-white border-2 border-sky-100 text-center space-y-3 shadow-cute card-hover">
            <div className="w-13 h-13 rounded-2xl bg-gradient-candy text-white font-black text-lg flex items-center justify-center mx-auto shadow-cute">
              3
            </div>
            <h3 className="font-black text-slate-900 text-base">Nhận Máy Tại ETown & Đi Chill</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Nhận máy tại điểm hẹn ETown Tân Bình hoặc nhận ship hỏa tốc 30 phút. Kèm đầy đủ thẻ nhớ, pin sạc, hướng dẫn sử dụng 1-1.
            </p>
          </div>
        </div>
      </section>

      {/* 6. GENUINE REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider block">
              Feedback Người Thật Việc Thật
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Khách Hàng Nói Gì Về THUECAM? 📸💖
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-[28px] bg-white border-2 border-sky-100 flex flex-col justify-between text-xs space-y-3 shadow-cute"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 italic leading-relaxed font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-sky-100 flex items-center justify-between">
                <span className="font-black text-slate-900">{rev.user_name}</span>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TOPIC CLUSTER & BLOG ARTICLES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider block">
              Góc Chia Sẻ Kinh Nghiệm
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Cẩm Nang Thuê & Bí Quyết Quay Chụp Đẹp 📖
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs text-[#0284c7] hover:text-[#0369a1] font-black flex items-center gap-1"
          >
            <span>Tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {recentArticles.slice(0, 3).map((art) => {
            let href = `/blog/${art.slug}`;
            if (art.type === 'guide') href = `/huong-dan/${art.slug}`;
            if (art.type === 'comparison') href = `/so-sanh/${art.slug}`;
            if (art.type === 'landing') href = `/${art.slug}`;

            return (
              <article
                key={art.id}
                className="rounded-[28px] overflow-hidden bg-white border-2 border-sky-100 card-hover flex flex-col group shadow-cute"
              >
                <div className="relative aspect-video w-full bg-sky-50">
                  <Image
                    src={art.featured_image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-black text-[#0284c7] uppercase tracking-wider">
                      {art.type === 'comparison'
                        ? 'So S��nh Trực Diện'
                        : art.type === 'guide'
                        ? 'Hướng Dẫn Kỹ Thuật'
                        : 'Cẩm Nang Thuê'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#0284c7] transition-colors mt-1 line-clamp-2">
                      <Link href={href}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-sky-100 text-[11px] text-slate-400 flex justify-between font-medium">
                    <span>Tác giả: {art.author_name}</span>
                    <span>{art.published_at.split('T')[0]}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 8. SEO FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-[32px] bg-white border-2 border-sky-100 shadow-cute space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[#0284c7] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Giải Đáp Thắc Mắc
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Câu Hỏi Thường Gặp Khi Thuê Máy Tại THUECAM 💬
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
              <h3 className="font-black text-slate-900 text-sm">
                Thủ tục thuê máy tại THUECAM cần những giấy tờ gì?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Khách hàng chỉ cần xuất trình Căn cước công dân (CCCD) gắn chip chính chủ và thanh toán tiền thuê. Đối với khách hàng không muốn để lại giấy tờ, có thể lựa chọn hình thức cọc tiền mặt hoặc bảo lưu hạn mức linh hoạt.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
              <h3 className="font-black text-slate-900 text-sm">
                Địa điểm nhận máy ở đâu?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Bạn có thể nhận máy trực tiếp tại <strong>ETown, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM</strong> (hỗ trợ test máy và hướng dẫn 1-1), hoặc chọn hình thức giao hỏa tốc 30 phút tận tay tại mọi quận huyện TP.HCM.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
              <h3 className="font-black text-slate-900 text-sm">
                Giá thuê hiển thị trên website đã bao gồm những gì?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Giá thuê trọn gói tính theo ngày (24h). Giá đã bao gồm đầy đủ bộ phụ kiện: pin dự phòng sạc sẵn, thẻ nhớ tốc độ cao SanDisk Extreme Pro 128GB, cáp sạc và túi đựng chống sốc.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
