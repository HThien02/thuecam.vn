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
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Star,
  CheckCircle2,
  Compass,
  Heart,
  Gift,
  Smile,
  Flame,
  Check,
} from 'lucide-react';

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const useCases = await getUseCases();
  const reviews = await getApprovedReviews();
  const recentArticles = await getArticles();

  const featuredProducts = products.slice(0, 6);

  const brandBubbles = [
    { name: 'DJI', count: 'Pocket 4, Mic 2, Flycam', color: 'from-pink-500 to-rose-400' },
    { name: 'SONY', count: 'FX3, A7C II, ZV-E10', color: 'from-purple-500 to-pink-500' },
    { name: 'GOPRO', count: 'Hero 13 Black Đi Biển', color: 'from-blue-500 to-cyan-400' },
    { name: 'INSTA360', count: 'X4 8K Quay 360°', color: 'from-amber-400 to-orange-500' },
    { name: 'CANON', count: 'G7X III, M50 Mark II', color: 'from-red-500 to-pink-500' },
    { name: 'FUJIFILM', count: 'Màu Film Retro Chill', color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      <HomeHero image={featuredProducts[0]?.primary_image} />

      {false && (
      <section className="relative pt-10 pb-16 overflow-hidden bg-gradient-to-b from-pink-100/60 via-rose-50/40 to-transparent">
        {/* Soft pastel ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-pink-400/20 via-rose-300/20 to-amber-200/20 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Cute Promo Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200/80 text-[#FF3877] text-xs font-black shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#FF3877] animate-ping" />
            <Gift className="w-3.5 h-3.5" />
            <span>Ưu đãi cộng dồn đến 40%: First Bill -30% theo CCCD + Thứ 6 -10%!</span>
          </div>

          {/* Slogan Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Thuê Máy Xịn 📸 <br className="hidden sm:inline" />
            <span className="text-gradient">Chụp Chill Hết Ý!</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Trải nghiệm các dòng máy quay du lịch hot nhất: <strong>DJI Pocket 4, Pocket 3, GoPro 13, Mini 4 Pro, Mic 2</strong>.
            Tặng kèm pin dự phòng + thẻ nhớ 128GB, giao hỏa tốc 30 phút tại TP.HCM & Hà Nội!
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/thue-camera-du-lich"
              className="px-7 py-3.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-black text-sm shadow-cute hover:shadow-cute-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Thuê Camera Du Lịch Hot</span>
            </Link>

            <Link
              href="/thiet-bi"
              className="px-7 py-3.5 rounded-full bg-white hover:bg-pink-50 text-slate-800 font-extrabold text-sm border border-pink-200/80 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Xem Tất Cả 20+ Thiết Bị</span>
              <ArrowRight className="w-4 h-4 text-[#FF3877]" />
            </Link>
          </div>

          {/* Brand Bubbles (Superior to competitor) */}
          <div className="pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Thương hiệu sẵn máy tại Showroom
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-3xl mx-auto">
              {brandBubbles.map((brand) => (
                <Link
                  key={brand.name}
                  href="/thiet-bi"
                  className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-pink-100/90 shadow-sm hover:shadow-cute transition-all group flex items-center gap-2 text-xs font-black text-slate-800"
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${brand.color}`} />
                  <span>{brand.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#FF3877]">
                    {brand.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick stats trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-pink-200/50 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Máy Mới 99% Chuẩn Zin</span>
                <span className="text-[11px] text-slate-500">Test kỹ, sạc đầy trước khi giao</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#FF3877] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Giao Hỏa Tốc 30 Phút</span>
                <span className="text-[11px] text-slate-500">Nội thành TP.HCM & Hà Nội</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Tặng Kèm Phụ Kiện</span>
                <span className="text-[11px] text-slate-500">Thẻ 128GB + Pin dự phòng</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#FF3877] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-[#FF3877]" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">4.9/5 Sao Hài Lòng</span>
                <span className="text-[11px] text-slate-500">Hơn 5,000+ lượt khách thuê</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider block">
              Danh Mục Thiết Bị
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Tìm Thiết Bị Đúng Gu Của Bạn ✨
            </h2>
          </div>
          <Link
            href="/thiet-bi"
            className="text-xs text-[#FF3877] hover:text-[#e02462] font-black flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="p-4 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 card-hover text-center flex flex-col items-center group shadow-sm hover:shadow-cute"
            >
              <div className="w-13 h-13 rounded-2xl bg-pink-50 group-hover:bg-gradient-candy group-hover:text-white flex items-center justify-center text-[#FF3877] mb-3 transition-colors shadow-inner">
                <Camera className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-900 group-hover:text-[#FF3877] transition-colors">
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
            <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Sản Phẩm Đang Cho Thuê Nhiều Nhất
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Top Máy Sẵn Kho Nhận Ngay Hôm Nay 🚀
            </h2>
          </div>
          <Link
            href="/thiet-bi"
            className="text-xs text-[#FF3877] hover:text-[#e02462] font-black flex items-center gap-1"
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
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-rose-50 border border-pink-100 shadow-cute">
          <div className="max-w-2xl mb-8">
            <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider block">
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
                className="p-6 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 card-hover flex flex-col justify-between group shadow-sm hover:shadow-cute"
              >
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF3877] transition-colors">
                    {uc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {uc.content}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-black text-[#FF3877] group-hover:translate-x-1 transition-transform">
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
          <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider block">
            Thủ Tục Siêu Nhanh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Thuê Máy Dễ Dàng Chỉ Với 3 Bước Đơn Giản ✨
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-pink-100 text-center space-y-3 shadow-cute card-hover">
            <div className="w-13 h-13 rounded-2xl bg-gradient-candy text-white font-black text-lg flex items-center justify-center mx-auto shadow-cute">
              1
            </div>
            <h3 className="font-black text-slate-900 text-base">Chọn Máy & Xem Lịch Trống</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kiểm tra trực tiếp lịch trống của máy online, chọn số ngày cần thuê từ 1 ngày đến dài hạn.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-pink-100 text-center space-y-3 shadow-cute card-hover">
            <div className="w-13 h-13 rounded-2xl bg-gradient-candy text-white font-black text-lg flex items-center justify-center mx-auto shadow-cute">
              2
            </div>
            <h3 className="font-black text-slate-900 text-base">Quét VietQR & Cọc Linh Hoạt</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Thanh toán tự động qua SePay VietQR. Hỗ trợ cọc bằng CCCD gắn chip nhanh chóng, không giữ tiền nhiều.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-pink-100 text-center space-y-3 shadow-cute card-hover">
            <div className="w-13 h-13 rounded-2xl bg-gradient-candy text-white font-black text-lg flex items-center justify-center mx-auto shadow-cute">
              3
            </div>
            <h3 className="font-black text-slate-900 text-base">Nhận Máy Tận Tay & Đi Chill</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Nhận máy tại Showroom hoặc nhận ship hỏa tốc 30 phút. Kèm đầy đủ thẻ nhớ, pin sạc, hướng dẫn sử dụng 1-1.
            </p>
          </div>
        </div>
      </section>

      {/* 6. GENUINE REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider block">
              Feedback Người Thật Việc Thật
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Khách Hàng Nói Gì Về THUECAM? 💕
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-white border border-pink-100 flex flex-col justify-between text-xs space-y-3 shadow-cute"
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

              <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                <span className="font-black text-slate-900">{rev.user_name}</span>
                {rev.rental_verified && (
                  <span className="badge-verified">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã Thuê Thật
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TOPIC CLUSTER & BLOG ARTICLES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider block">
              Góc Chia Sẻ Kinh Nghiệm
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Cẩm Nang Thuê & Bí Quyết Quay Chụp Đẹp 📖
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs text-[#FF3877] hover:text-[#e02462] font-black flex items-center gap-1"
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
                className="rounded-3xl overflow-hidden bg-white border border-pink-100 card-hover flex flex-col group shadow-cute"
              >
                <div className="relative aspect-video w-full bg-pink-50">
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
                    <span className="text-[11px] font-black text-[#FF3877] uppercase tracking-wider">
                      {art.type === 'comparison'
                        ? 'So Sánh Trực Diện'
                        : art.type === 'guide'
                        ? 'Hướng Dẫn Kỹ Thuật'
                        : 'Cẩm Nang Thuê'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#FF3877] transition-colors mt-1 line-clamp-2">
                      <Link href={href}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-pink-100 text-[11px] text-slate-400 flex justify-between font-medium">
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
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-pink-100 shadow-cute space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[#FF3877] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Giải Đáp Thắc Mắc
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Câu Hỏi Thường Gặp Khi Thuê Máy Tại THUECAM 💬
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1.5">
              <h3 className="font-black text-slate-900 text-sm">
                Thủ tục thuê máy tại THUECAM cần những giấy tờ gì?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Khách hàng chỉ cần xuất trình Căn cước công dân (CCCD) gắn chip chính chủ và thanh toán tiền thuê. Đối với khách hàng không muốn để lại giấy tờ, có thể lựa chọn hình thức cọc tiền mặt hoặc bảo lưu hạn mức linh hoạt.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1.5">
              <h3 className="font-black text-slate-900 text-sm">
                Giá thuê hiển thị trên website đã bao gồm những gì?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Giá thuê trọn gói tính theo ngày (24h). Giá đã bao gồm đầy đủ bộ phụ kiện: pin dự phòng sạc sẵn, thẻ nhớ tốc độ cao SanDisk Extreme Pro 128GB, cáp sạc và túi đựng chống sốc.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1.5">
              <h3 className="font-black text-slate-900 text-sm">
                Mình chưa từng dùng máy quay bao giờ thì có được hướng dẫn không?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Bạn hoàn toàn yên tâm nhé! Kỹ thuật viên của THUECAM sẽ cài đặt sẵn cấu hình đẹp nhất và hướng dẫn sử dụng trực tiếp 1-1 tận tình trong 5 phút khi bàn giao máy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
