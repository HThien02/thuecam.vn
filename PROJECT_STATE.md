# THUECAM.VN - HỒ SƠ KIẾN TRÚC & TRẠNG THÁI DỰ ÁN (PROJECT STATE)

> **Tài liệu này là nguồn tham chiếu chuẩn (Single Source of Truth) ghi lại toàn bộ cấu trúc, công nghệ, tiến độ và hướng dẫn cho tất cả các phiên làm việc tiếp theo.**

---

## 1. THÔNG TIN DỰ ÁN & STACK CÔNG NGHỆ CHUẨN (FIXED PRODUCTION STACK)

| Hạng mục | Quy định chuẩn | Ghi chú |
| :--- | :--- | :--- |
| **Domain chính thức** | `https://thuecam.vn` | Canonical duy nhất, không dùng www, không dùng http, preview có noindex |
| **Biến môi trường URL** | `NEXT_PUBLIC_SITE_URL=https://thuecam.vn` | Sử dụng ở mọi nơi (metadata, canonical, sitemap, proxy) |
| **Hosting** | **Vercel** | Triển khai qua Vercel Git Integration |
| **Framework** | **Next.js 16 (App Router + Turbopack)** | Chuẩn Next.js mới: dùng `src/proxy.ts` thay cho `middleware.ts` |
| **Ngôn ngữ & Runtime** | **TypeScript + React 19** | Server Components mặc định, Client Components khi cần tương tác |
| **Giao diện (CSS)** | **Tailwind CSS v4** | Dark mode cao cấp, Glassmorphism, Micro-animations, Icons từ Lucide |
| **Cơ sở dữ liệu** | **Supabase PostgreSQL** | Schema sẵn sàng tại `supabase/migrations/01_initial_schema.sql` (RLS) |
| **Xác thực (Auth)** | **Supabase Auth** | Sử dụng `@supabase/ssr` cho Next.js App Router |
| **Lưu trữ ảnh/media** | **Supabase Storage** | Bucket public cho ảnh sản phẩm, gallery, tài liệu |
| **Cổng thanh toán** | **SePay (VietQR)** | Sinh mã QR tự động kèm mã đơn `TC123456`, webhook đối soát tự động |
| **Mô hình kinh doanh** | **Cho thuê thiết bị (Rentals)** | Giá thuê theo ngày, tiền cọc, phụ kiện đi kèm, kiểm tra lịch trống |
| **Visual 3D** | **Three.js** | Tối ưu không chặn LCP: mặc định hiển thị ảnh tĩnh, kích hoạt 3D khi click |

---

## 2. BẢN ĐỒ CẤU TRÚC ROUTES (INVENTORY OF ROUTES)

### A. Các Route Indexable (Được Google lập chỉ mục & có trong `sitemap.xml`)

| Đường dẫn (URL) | Loại trang | Mục đích SEO & Chức năng |
| :--- | :--- | :--- |
| `/` | Trang chủ | Tổng quan thương hiệu, sản phẩm hot, ưu đãi, tin cậy |
| `/thiet-bi` | Catalog | Danh mục toàn bộ thiết bị cho thuê |
| `/thiet-bi/[slug]` | Chi tiết sản phẩm | SEO Product Schema (Rental), 3D Viewer, phụ kiện, đặt cọc, booking modal |
| `/danh-muc/[slug]` | Danh mục cha | Phân loại: camera du lịch, action camera, pocket, flycam, micro, gimbal |
| `/nhu-cau/[slug]` | Nhu cầu sử dụng | Tối ưu search intent: quay vlog, quay tiktok, đi phượt, sự kiện |
| `/thuong-hieu/[slug]` | Thương hiệu | Lọc theo hãng: DJI, Sony, GoPro, Insta360 |
| `/dia-diem/[slug]` | Chi nhánh thật | Local SEO: TP. Hồ Chí Minh (`/dia-diem/tphcm`), Hà Nội (`/dia-diem/ha-noi`) |
| `/thue-camera-du-lich` | **Pillar Page** | Trục nội dung chính (Cluster Pillar) cho toàn bộ từ khóa du lịch |
| `/thue-camera` | Landing page SEO | Mục tiêu từ khóa chung "thuê camera" |
| `/thue-camera-vlog` | Landing page SEO | Mục tiêu từ khóa "thuê camera quay vlog" |
| `/thue-camera-tiktok` | Landing page SEO | Mục tiêu từ khóa "thuê camera quay tiktok" |
| `/thue-action-camera` | Landing page SEO | Mục tiêu từ khóa "thuê action camera" |
| `/thue-camera-360` | Landing page SEO | Mục tiêu từ khóa "thuê camera 360" |
| `/thue-flycam` | Landing page SEO | Mục tiêu từ khóa "thuê flycam", "thuê drone" |
| `/thue-gimbal` | Landing page SEO | Mục tiêu từ khóa "thuê gimbal chống rung" |
| `/thue-micro` | Landing page SEO | Mục tiêu từ khóa "thuê micro không dây", "thuê dji mic" |
| `/blog` | Blog Hub | Kênh nội dung SEO thông tin, kiến thức sáng tạo nội dung |
| `/blog/[slug]` | Bài viết blog | Bài viết hỗ trợ cluster (đánh giá chuyên sâu, review) |
| `/huong-dan/[slug]` | Cẩm nang hướng dẫn | Cẩm nang kỹ thuật (cài đặt profile màu, shutter speed, mic) |
| `/so-sanh/[slug]` | Bài so sánh | So sánh trực diện (ví dụ: DJI Pocket 4 vs Pocket 3) |
| `/gioi-thieu` | Trust page | Giới thiệu công ty, đội ngũ chuyên gia, tầm nhìn |
| `/chinh-sach-thue` | Trust page | Quy định thủ tục thuê, kiểm tra thiết bị, bàn giao |
| `/chinh-sach-dat-coc` | Trust page | Quy định linh hoạt cọc tiền mặt hoặc giấy tờ tuỳ thân |
| `/chinh-sach-huy` | Trust page | Chính sách hủy đơn và hoàn tiền minh bạch |
| `/chinh-sach-bao-mat` | Trust page | Chính sách bảo mật thông tin người dùng |
| `/dieu-khoan-su-dung`| Trust page | Điều khoản pháp lý dịch vụ |
| `/lien-he` | Trust page | Địa chỉ showroom, hotline 24/7, form yêu cầu tư vấn |

### B. Các Route Noindex (Không lập chỉ mục để tránh loãng PageRank & URL Bloat)

| Đường dẫn (URL) | Chỉ thị Robots | Lý do |
| :--- | :--- | :--- |
| `/search` | `NOINDEX, FOLLOW` | Bộ lọc tìm kiếm động (tránh sinh hàng ngàn URL trùng lặp `?price=...&date=...`) |
| `/admin/*` | `NOINDEX, NOFOLLOW` | Phân hệ quản trị (SEO, CMS, Reviews, Redirects) |
| `/api/*` | `Disallowed in robots.txt` | Endpoint API và Webhook |

---

## 3. CHIẾN LƯỢC SEO & CẤU TRÚC KỸ THUẬT (TECHNICAL SEO)

1. **Server-Side Rendering (SSR)**:
   - 100% nội dung quan trọng cho SEO (Tiêu đề, H1, đoạn giới thiệu, thông số máy, giá thuê, phụ kiện) được render thành HTML tĩnh ngay từ server.
   - Tuyệt đối không chờ `useEffect` ở client rồi mới fetch dữ liệu.
2. **Xử lý Dữ liệu có Cấu trúc (JSON-LD Schemas)**:
   - File: `src/lib/seo/jsonld.tsx`
   - **Product Rental Schema**: Khai báo `businessFunction: https://schema.org/Rental`, `UnitPriceSpecification: DAY`, đơn vị `VND`.
   - **AggregateRating & Review**: Chỉ sinh schema khi có đánh giá thật đã được admin duyệt (`APPROVED`).
   - **BreadcrumbList**: Tự động sinh breadcrumb khớp với giao diện hiển thị.
   - **LocalBusiness**: Tọa độ, hotline, địa chỉ thực tế tại TP.HCM và Hà Nội.
   - **Article / BlogPosting**: Khai báo tác giả, người kiểm duyệt chuyên môn, ngày đăng, ngày sửa đổi.
3. **Internal Linking & Topic Clusters**:
   - Trang Pillar (`/thue-camera-du-lich`) trỏ liên kết đến các bài viết vệ tinh (`/blog/dji-pocket-4-la-gi`, `/so-sanh/dji-pocket-4-vs-pocket-3`, `/huong-dan/dji-pocket-4-quay-du-lich`) và các sản phẩm liên quan.
   - Mỗi trang sản phẩm trỏ liên kết chéo đến danh mục, thương hiệu, nhu cầu, cẩm nang hướng dẫn và bài so sánh.
4. **Tối ưu Core Web Vitals (CWV)**:
   - **LCP (< 2.5s)**: Hero image dùng `priority` của `next/image`. Trình 3D Three.js chỉ khởi chạy khi người dùng chủ động bấm "Bật Xem Mô Hình 3D".
   - **CLS (< 0.1)**: Tất cả hình ảnh có kích thước cố định hoặc `aspect-ratio`.
   - **INP (< 200ms)**: Lazy load các module nặng bên dưới màn hình đầu tiên (below the fold).

---

## 4. TỔ CHỨC THƯ MỤC SOURCE CODE

```
thuecam.vn/
├── public/                     # Ảnh tĩnh, icon, favicon, logo
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public pages)      # Toàn bộ 31+ routes công khai
│   │   ├── admin/              # Dashboard quản trị SEO & CMS
│   │   │   ├── seo/            # Cấu hình SEO & Google SERP Simulator
│   │   │   ├── seo/health/     # Audit sức khỏe SEO (kiểm tra title, meta, alt...)
│   │   │   ├── content/        # Quản lý bài viết CMS (Draft, Published, Archived)
│   │   │   ├── reviews/        # Kiểm duyệt đánh giá khách hàng
│   │   │   └── redirects/      # Quản lý chuyển hướng 301
│   │   ├── api/
│   │   │   └── webhooks/sepay/ # Endpoint nhận thông báo chuyển khoản SePay
│   │   ├── not-found.tsx       # Trang 404 thân thiện người dùng
│   │   ├── robots.ts           # Sinh robots.txt chuẩn production
│   │   └── sitemap.ts          # Sinh sitemap.xml động
│   ├── components/
│   │   ├── analytics/          # Script nhúng Google Analytics 4 (gtag)
│   │   ├── booking/            # Modal đặt thuê, date picker, tính cọc, SePay QR
│   │   ├── common/             # Header, Footer, Breadcrumbs
│   │   ├── contact/            # Form gửi yêu cầu tư vấn (ContactFormClient)
│   │   ├── product/            # ProductCard, Product3DViewer, Actions
│   │   └── seo/                # CuratedLandingTemplate
│   ├── lib/
│   │   ├── analytics/          # Gtag helpers & typed events
│   │   ├── data/               # Data layer (mock-data.ts & index.ts)
│   │   ├── seo/                # metadata.ts (constructMetadata) & jsonld.tsx
│   │   └── supabase/           # server.ts, client.ts, admin.ts (@supabase/ssr)
│   ├── proxy.ts                # Next.js 16 Proxy: điều hướng 301 & bảo vệ preview
│   └── types/                  # Type definitions cho toàn bộ thực thể
├── supabase/
│   └── migrations/             # 01_initial_schema.sql (PostgreSQL Supabase)
├── .env.example                # Mẫu biến môi trường
├── .env.local                  # Biến môi trường cục bộ
└── PROJECT_STATE.md            # Tài liệu này
```

---

## 5. NHẬT KÝ TIẾN ĐỘ (PROGRESS LOG)

### Phiên làm việc gần nhất:
1. **Kiểm tra kiến trúc & rà soát toàn bộ source code**:
   - Xác nhận tất cả các yêu cầu về Stack, SEO, Supabase, SePay, Three.js, Topic Cluster đã được triển khai đầy đủ.
2. **Sửa lỗi Typecheck / Compile**:
   - `src/app/lien-he/page.tsx`: Bổ sung `import ContactFormClient from '@/components/contact/ContactFormClient';` (Khắc phục lỗi TS2304).
3. **Cập nhật Robots Directive**:
   - `src/app/robots.ts`: Loại bỏ `/search*` khỏi `disallow` để bot có thể crawl trang tìm kiếm và tuân thủ thẻ `<meta name="robots" content="noindex, follow">`, đảm bảo bot theo dõi được các liên kết sản phẩm bên trong mà không index URL tham số rác.
4. **Xác thực bản Build**:
   - Chạy thành công `npm run build` với Turbopack: Tạo 31 static pages, server dynamic routes, proxy middleware và API endpoint với **0 lỗi**.
5. **Tạo tài liệu lưu trữ**:
   - Tạo file `PROJECT_STATE.md` để lưu lại toàn bộ tiến độ và hướng dẫn chi tiết cho các lần chạy tiếp theo.

---

## 6. HƯỚNG DẪN KẾT NỐI MÔI TRƯỜNG THẬT CHO PHIÊN TIẾP THEO

Khi bạn muốn đưa website lên môi trường chạy thật với cơ sở dữ liệu Supabase và tài khoản SePay thực:

1. **Kết nối Supabase thật**:
   - Tạo project mới trên Supabase Dashboard.
   - Mở SQL Editor trong Supabase và copy toàn bộ nội dung file `supabase/migrations/01_initial_schema.sql` vào chạy để tạo bảng, quan hệ, RLS và policies.
   - Điền các thông tin vào file `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
     SUPABASE_SERVICE_ROLE_KEY=ey...
     ```
2. **Cấu hình SePay Webhook**:
   - Đăng ký tài khoản trên `my.sepay.vn`, liên kết số tài khoản ngân hàng của cửa hàng.
   - Tạo Webhook trỏ về `https://thuecam.vn/api/webhooks/sepay` với token bảo mật `SEPAY_WEBHOOK_TOKEN`.
   - Cập nhật số tài khoản và ngân hàng trong `src/components/booking/BookingModal.tsx`.
3. **Google Search Console**:
   - Thêm tài nguyên `https://thuecam.vn`.
   - Gửi sơ đồ trang web: `https://thuecam.vn/sitemap.xml`.
