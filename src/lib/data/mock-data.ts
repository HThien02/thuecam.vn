import {
  Product,
  Category,
  UseCase,
  Brand,
  Location,
  Article,
  Review,
  RedirectRule,
  SeoSettings,
} from '@/types';

export const INITIAL_SEO_SETTINGS: SeoSettings = {
  id: 'global-seo-settings',
  site_title: 'THUECAM - Dịch Vụ Cho Thuê Camera & Thiết Bị Sáng Tạo Nội Dung Hàng Đầu',
  site_description:
    'Dịch vụ cho thuê máy ảnh, action cam, DJI Pocket 4, flycam, gimbal, micro chính hãng giá từ 100K/ngày tại TP.HCM & Hà Nội. Đặt thuê online nhận máy ngay.',
  default_og_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  twitter_handle: '@thuecamvn',
  business_name: 'THUECAM VIỆT NAM',
  hotline: '0901.234.567',
  email: 'lienhe@thuecam.vn',
  address: '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  opening_hours: '08:00 - 21:30 (Thứ 2 - Chủ Nhật)',
  google_verification_id: 'GSC-THUECAM-VN-VERIFIED-2026',
  global_noindex_enabled: false,
  updated_at: '2026-09-21T00:00:00Z',
};

export const BRANDS: Brand[] = [
  {
    id: 'b-dji',
    slug: 'dji',
    name: 'DJI',
    logo_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=200&auto=format&fit=crop&q=80',
    description: 'Thương hiệu dẫn đầu thế giới về gimbal, pocket camera, flycam và micro không dây cho nhà sáng tạo nội dung.',
    seo_title: 'Thuê Thiết Bị DJI Chính Hãng | Pocket, Flycam, Gimbal, Mic | THUECAM',
    seo_description: 'Bảng giá thuê thiết bị DJI mới nhất: DJI Pocket 4, Pocket 3, Mic 2, RS4, Mini 4 Pro giá từ 150K/ngày. Thiết bị chuẩn zin, kèm đầy đủ phụ kiện.',
    indexable: true,
  },
  {
    id: 'b-sony',
    slug: 'sony',
    name: 'Sony',
    logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80',
    description: 'Dòng máy ảnh và máy quay điện ảnh mirrorless full-frame chuẩn điện ảnh hàng đầu thế giới.',
    seo_title: 'Thuê Máy Ảnh & Máy Quay Sony Full-Frame Chính Hãng | THUECAM',
    seo_description: 'Cho thuê máy ảnh Sony FX3, A7C II, A7 IV và ống kính G-Master giá rẻ tại TP.HCM & Hà Nội. Hỗ trợ kỹ thuật tận tâm.',
    indexable: true,
  },
  {
    id: 'b-gopro',
    slug: 'gopro',
    name: 'GoPro',
    logo_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80',
    description: 'Camera hành trình siêu bền bỉ, chống rung đỉnh cao HyperSmooth cho dân du lịch, phượt và thể thao mạo hiểm.',
    seo_title: 'Thuê GoPro Hero Chính Hãng Đi Phượt, Lặn Biển | THUECAM',
    seo_description: 'Cho thuê GoPro Hero 13 Black kèm bộ phụ kiện phượt, lặn biển chống nước 10m. Pin dự phòng, thẻ nhớ tốc độ cao.',
    indexable: true,
  },
  {
    id: 'b-insta360',
    slug: 'insta360',
    name: 'Insta360',
    logo_url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=200&auto=format&fit=crop&q=80',
    description: 'Tiên phong công nghệ camera 360 độ và AI tracking, góc nhìn vô tận không góc chết.',
    seo_title: 'Thuê Camera 360 Insta360 X4 8K Chính Hãng | THUECAM',
    seo_description: 'Dịch vụ thuê Insta360 X4 quay video 8K 360 độ, gậy tàng hình selfie stick, chống rung FlowState giá ưu đãi.',
    indexable: true,
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-camera-du-lich',
    slug: 'camera-du-lich',
    name: 'Camera Du Lịch',
    h1: 'Thuê Camera Du Lịch Nhỏ Gọn & Tiện Lợi',
    intro_content:
      'Tổng hợp các dòng máy quay nhỏ gọn, chống rung xuất sắc, pin trâu và dễ dàng bỏ túi khi di chuyển. Phù hợp cho các chuyến đi biển, leo núi, vi vu khám phá.',
    seo_title: 'Thuê Camera Du Lịch Nhỏ Gọn, Chống Rung Cực Tốt | THUECAM',
    seo_description:
      'Dịch vụ cho thuê camera du lịch bỏ túi như DJI Pocket 4, GoPro 13, Insta360 X4. Thiết bị đầy đủ phụ kiện, pin sơ cua, giá từ 150K/ngày.',
    og_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
    display_order: 1,
    indexable: true,
  },
  {
    id: 'cat-action-camera',
    slug: 'action-camera',
    name: 'Action Camera',
    h1: 'Thuê Action Camera Chống Nước & Hành Trình',
    intro_content:
      'Thiết bị ghi hình hành động siêu bền, chịu va đập, chống nước trực tiếp không cần vỏ case, góc siêu rộng và chống rung HyperSmooth / FlowState.',
    seo_title: 'Thuê Action Cam Chống Nước Đi Biển, Phượt Xe Máy | THUECAM',
    seo_description:
      'Cho thuê action camera GoPro Hero 13, Insta360 Ace Pro, DJI Action 4 giá rẻ. Tặng kèm ngàm gắn nón bảo hiểm, phao bơi, thẻ SanDisk Extreme.',
    og_image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop',
    display_order: 2,
    indexable: true,
  },
  {
    id: 'cat-pocket-camera',
    slug: 'pocket-camera',
    name: 'Pocket Camera',
    h1: 'Thuê Pocket Camera Gimbal Tích Hợp',
    intro_content:
      'Dòng camera bỏ túi có tích hợp sẵn gimbal cơ học 3 trục, cảm biến 1-inch sắc nét cả ngày lẫn đêm, tính năng xoay ngang/dọc tự động cho TikTok và YouTube.',
    seo_title: 'Thuê Pocket Camera DJI Pocket 4, Pocket 3 Creator | THUECAM',
    seo_description:
      'Cho thuê DJI Pocket 4 Creator Combo, Pocket 3 giá từ 200K/ngày. Cảm biến 1 inch quay 4K 120fps, mic không dây DJI Mic 2 chống ồn.',
    og_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop',
    display_order: 3,
    indexable: true,
  },
  {
    id: 'cat-flycam',
    slug: 'flycam',
    name: 'Flycam & Drone',
    h1: 'Thuê Flycam Ghi Hình Từ Trên Cao',
    intro_content:
      'Thiết bị bay flycam cảm biến vật cản đa hướng, truyền sóng xa hàng chục km, thời lượng bay lên tới 35-45 phút mỗi viên pin.',
    seo_title: 'Thuê Flycam DJI Mini 4 Pro, Air 3 Bay Quay Sắc Nét | THUECAM',
    seo_description:
      'Dịch vụ cho thuê flycam DJI Mini 4 Pro combo 3 pin sạc, tay cầm có màn hình RC 2, chất lượng 4K HDR quay dọc TikTok.',
    og_image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    display_order: 4,
    indexable: true,
  },
  {
    id: 'cat-micro',
    slug: 'micro-thu-am',
    name: 'Micro Thu Âm',
    h1: 'Thuê Micro Không Dây Lọc Ồn Chuyên Nghiệp',
    intro_content:
      'Micro thu âm cài áo không dây khử tạp âm AI, ghi âm nội bộ 32-bit float không lo vỡ tiếng, khoảng cách kết nối 250m ổn định.',
    seo_title: 'Thuê Micro Cài Áo Không Dây DJI Mic 2, Rode Wireless PRO | THUECAM',
    seo_description:
      'Cho thuê micro thu âm không dây DJI Mic 2, Rode Wireless GO II chính hãng. Tương thích iPhone, Android, máy ảnh.',
    og_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    display_order: 5,
    indexable: true,
  },
  {
    id: 'cat-gimbal',
    slug: 'gimbal',
    name: 'Gimbal Chống Rung',
    h1: 'Thuê Gimbal Chống Rung Điện Thoại & Máy Ảnh',
    intro_content:
      'Tay cầm chống rung 3 trục cơ học cho máy ảnh mirrorless và smartphone, chống rung mượt mà như đường ray điện ảnh dolly.',
    seo_title: 'Thuê Gimbal DJI RS4, DJI Osmo Mobile 6 Giá Tốt | THUECAM',
    seo_description:
      'Cho thuê gimbal chống rung DJI RS4, RS3 Pro cho máy ảnh Sony/Canon và gimbal điện thoại OM6 giá chỉ từ 100K/ngày.',
    og_image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop',
    display_order: 6,
    indexable: true,
  },
];

export const USE_CASES: UseCase[] = [
  {
    id: 'uc-vlog',
    slug: 'quay-vlog',
    name: 'Quay Vlog',
    h1: 'Thuê Thiết Bị Quay Vlog Cá Nhân & Đời Sống',
    content:
      'Để quay vlog thu hút, bạn cần một thiết bị có khả năng lấy nét khuôn mặt nhanh, màu da đẹp, chống rung tốt khi vừa đi vừa nói và micro thu âm rõ ràng không dính gió.',
    faq: [
      {
        question: 'Mới tập quay vlog thì nên thuê máy nào dễ dùng nhất?',
        answer: 'DJI Pocket 4 hoặc Pocket 3 là lựa chọn số 1: mở máy trong 1 giây, màn hình xoay tiện lợi, mic không dây kết nối tự động, không cần kiến thức kỹ thuật phức tạp.',
      },
      {
        question: 'Thuê máy quay vlog có kèm thẻ nhớ và pin phụ không?',
        answer: 'THUECAM luôn tặng kèm thẻ nhớ SanDisk Extreme Pro tốc độ cao và đầy đủ cáp sạc, túi đựng cho tất cả đơn thuê.',
      },
    ],
    seo_title: 'Thuê Máy Quay Vlog Bỏ Túi Đẹp & Lọc Âm Tốt | THUECAM',
    seo_description:
      'Combo thiết bị quay vlog chuyên nghiệp: DJI Pocket 4, Mic 2, chân tripod mini. Trọng lượng nhẹ, chống rung mượt mà, giá từ 180K/ngày.',
    og_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
  },
  {
    id: 'uc-tiktok',
    slug: 'quay-tiktok',
    name: 'Quay TikTok',
    h1: 'Thuê Camera Quay Video Dọc Chuẩn TikTok & Reels',
    content:
      'Các nền tảng video ngắn đòi hỏi khung hình dọc 9:16 sắc nét, màu sắc nịnh mắt và âm thanh voiceover trong trẻo để giữ chân người xem trong 3 giây đầu.',
    faq: [
      {
        question: 'Các máy có hỗ trợ chế độ quay dọc 9:16 gốc không?',
        answer: 'Có, DJI Pocket 4, Pocket 3 và DJI Mini 4 Pro đều hỗ trợ chế độ True Vertical Shooting không bị crop góc nhìn.',
      },
    ],
    seo_title: 'Thuê Camera Quay TikTok, Reels Sắc Nét 4K | THUECAM',
    seo_description:
      'Gói thiết bị chuyên quay video ngắn TikTok, Shorts: màu da nịnh mắt, quay dọc 9:16 nguyên bản, micro lọc âm khử ồn AI đỉnh cao.',
    og_image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
  },
  {
    id: 'uc-du-lich',
    slug: 'du-lich',
    name: 'Đi Du Lịch',
    h1: 'Thuê Máy Ảnh & Camera Hành Trình Đi Du Lịch',
    content:
      'Những chuyến đi khám phá đòi hỏi máy phải nhẹ, pin dùng được cả ngày, chống bụi nước và quay được cả phong cảnh lẫn con người.',
    faq: [
      {
        question: 'Đi biển hoặc lặn san hô thì thuê máy nào an toàn?',
        answer: 'Nên thuê GoPro Hero 13 kèm phao nổi cầm tay và kính lọc phân cực, an toàn tuyệt đối dưới nước tới 10m mà không cần ốp bảo vệ.',
      },
    ],
    seo_title: 'Thuê Camera Đi Du Lịch, Phượt Biển, Leo Núi | THUECAM',
    seo_description:
      'Thuê camera đi du lịch gọn nhẹ, bền bỉ: DJI Pocket 4, GoPro 13, Insta360 X4. Trọn gói phụ kiện pin sơ cua, thẻ nhớ, giá thuê linh hoạt theo ngày.',
    og_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
  },
];

export const LOCATIONS: Location[] = [
  {
    id: 'loc-tphcm',
    slug: 'tphcm',
    name: 'TP. Hồ Chí Minh',
    address: '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    phone: '0901.234.567',
    email: 'hcm@thuecam.vn',
    google_maps_url: 'https://maps.google.com/?q=THUECAM+TPHCM',
    intro_content:
      'Showroom trung tâm Quận 1 và kho kỹ thuật Tân Bình phục vụ giao nhận máy hỏa tốc trong 30 phút toàn TP.HCM. Hỗ trợ test máy trực tiếp, hướng dẫn sử dụng 1-1.',
    seo_title: 'Thuê Camera TPHCM Giá Rẻ | Nhận Máy Ngay 30 Phút | THUECAM',
    seo_description:
      'Dịch vụ cho thuê camera, máy ảnh, gimbal, mic thu âm tại TPHCM. Showroom Quận 1 & Tân Bình, thủ tục nhanh gọn chỉ cần CCCD hoặc cọc linh hoạt.',
    indexable: true,
  },
  {
    id: 'loc-ha-noi',
    slug: 'ha-noi',
    name: 'Hà Nội',
    address: '45 Phố Giảng Võ, Phường Cát Linh, Quận Đống Đa, Hà Nội',
    phone: '0902.345.678',
    email: 'hanoi@thuecam.vn',
    google_maps_url: 'https://maps.google.com/?q=THUECAM+HANOI',
    intro_content:
      'Chi nhánh Đống Đa & Cầu Giấy cung cấp đầy đủ các dòng máy quay cao cấp cho các đoàn làm phim, vlogger, du khách khám phá thủ đô.',
    seo_title: 'Thuê Camera Hà Nội Chính Hãng | Giao Tận Nơi Nhanh | THUECAM',
    seo_description:
      'Dịch vụ cho thuê máy ảnh, action cam, DJI Pocket tại Hà Nội. Thiết bị đời mới nhất, pin sạc sẵn đầy đủ, giao nhận tận nơi các quận nội thành.',
    indexable: true,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-dji-pocket-4-creator',
    slug: 'dji-pocket-4-creator',
    name: 'DJI Pocket 4 Creator Combo',
    sku: 'TC-DJI-PK4-CC',
    brand_id: 'b-dji',
    category_id: 'cat-pocket-camera',
    excerpt: 'Camera bỏ túi tích hợp gimbal 3 trục thế hệ mới nhất, cảm biến nâng cấp, quay 4K 120fps và bộ phụ kiện Creator cao cấp.',
    description: `DJI Pocket 4 Creator Combo là dòng camera cầm tay đột phá nhất dành cho vlogger và các nhà sáng tạo nội dung video ngắn.

### Điểm nổi bật khi thuê DJI Pocket 4:
- **Cảm biến thế hệ mới**: Khả năng ghi hình thiếu sáng xuất sắc, dải nhạy sáng HDR nâng cao giữ trọn chi tiết vùng sáng và tối.
- **Gimbal 3 trục cơ học**: Ổn định hình ảnh tuyệt đối ngay cả khi bạn chạy bộ hoặc di chuyển trên địa hình gồ ghề.
- **Micro không dây DJI Mic thế hệ mới**: Thu âm định hướng, lọc tạp âm bằng AI và ghi file dự phòng không lo mất tiếng.
- **Pin dung lượng cao**: Quay liên tục lên đến 160 phút và hỗ trợ sạc nhanh 80% chỉ trong 16 phút.`,
    specs: {
      'Cảm biến': '1-inch CMOS HDR Nâng Cao',
      'Độ phân giải video': '4K/120fps, 1080p/240fps',
      'Ống kính': 'Góc rộng 20mm f/1.8 tương đương',
      'Chống rung': 'Gimbal cơ học 3 trục',
      'Thời lượng pin': 'Lên tới 160 phút (Hỗ trợ sạc nhanh PD)',
      'Màn hình': 'OLED 2.0 inch xoay thông minh',
      'Trọng lượng': '185g',
    },
    accessories_included: [
      'Thân máy DJI Pocket 4',
      'Bộ phát Micro không dây DJI Mic kèm bông lọc gió',
      'Tay cầm kéo dài tích hợp pin phụ',
      'Chân đế mini tripod',
      'Ống kính góc siêu rộng gắn nam châm',
      'Thẻ nhớ SanDisk Extreme Pro 128GB U3 V30',
      'Hộp cứng bảo vệ & cáp sạc Type-C',
    ],
    rental_price_per_day: 200000,
    deposit_amount: 3000000,
    primary_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 8,
    status: 'ACTIVE',
    seo_title: 'Thuê DJI Pocket 4 Creator Chính Hãng | Giá từ 200K/ngày | THUECAM',
    seo_description:
      'Thuê DJI Pocket 4 Creator với giá từ 200.000đ/ngày. Kiểm tra lịch trống, đặt thuê online và thanh toán nhanh tại THUECAM.',
    seo_keywords: 'thuê dji pocket 4, thue pocket 4 creator, camera quay vlog, thuê camera du lịch tphcm',
    canonical_url: 'https://thuecam.vn/thiet-bi/dji-pocket-4-creator',
    og_title: 'Thuê DJI Pocket 4 Creator Chính Hãng | Giá từ 200K/ngày | THUECAM',
    og_description: 'Thuê DJI Pocket 4 Creator với giá từ 200.000đ/ngày. Kiểm tra lịch trống, đặt thuê online và thanh toán nhanh tại THUECAM.',
    og_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 4.9,
    review_count: 28,
  },
  {
    id: 'prod-dji-pocket-3-creator',
    slug: 'dji-pocket-3-creator',
    name: 'DJI Pocket 3 Creator Combo',
    sku: 'TC-DJI-PK3-CC',
    brand_id: 'b-dji',
    category_id: 'cat-pocket-camera',
    excerpt: 'Cảm biến 1-inch CMOS quay 4K 120fps, màn hình cảm ứng xoay 2-inch, micro DJI Mic 2 đi kèm.',
    description: 'Thiết bị quay vlog bán chạy số 1 thị trường với cảm biến 1-inch ghi hình thiếu sáng tuyệt vời, âm thanh chuẩn studio cùng mic không dây DJI Mic 2.',
    specs: {
      'Cảm biến': '1-inch CMOS',
      'Độ phân giải video': '4K/120fps',
      'Chống rung': 'Gimbal 3 trục',
      'Màn hình': '2.0 inch OLED cảm ứng xoay',
      'Trọng lượng': '179g',
    },
    accessories_included: [
      'Thân máy Pocket 3',
      'Micro DJI Mic 2 kèm lọc gió',
      'Tay cầm pin Battery Handle',
      'Mini tripod',
      'Thẻ nhớ 128GB',
      'Túi đựng chính hãng',
    ],
    rental_price_per_day: 180000,
    deposit_amount: 2500000,
    primary_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 12,
    status: 'ACTIVE',
    seo_title: 'Thuê DJI Pocket 3 Creator Combo | Giá từ 180K/ngày | THUECAM',
    seo_description:
      'Dịch vụ cho thuê DJI Pocket 3 Creator combo giá chỉ từ 180.000đ/ngày. Đầy đủ phụ kiện DJI Mic 2, tay cầm pin mở rộng, thẻ nhớ tốc độ cao.',
    canonical_url: 'https://thuecam.vn/thiet-bi/dji-pocket-3-creator',
    og_title: 'Thuê DJI Pocket 3 Creator Combo | Giá từ 180K/ngày | THUECAM',
    og_description: 'Dịch vụ cho thuê DJI Pocket 3 Creator combo giá chỉ từ 180.000đ/ngày.',
    og_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 4.9,
    review_count: 45,
  },
  {
    id: 'prod-gopro-hero-13-black',
    slug: 'gopro-hero-13-black',
    name: 'GoPro Hero 13 Black',
    sku: 'TC-GP-H13-BLK',
    brand_id: 'b-gopro',
    category_id: 'cat-action-camera',
    excerpt: 'Camera hành trình đỉnh cao với hệ thống ngàm ống kính HB-Series, chống rung HyperSmooth 6.0 và quay video 5.3K 60fps.',
    description: 'GoPro Hero 13 Black được trang bị pin Enduro dung lượng lớn hơn, chống nước nguyên khối 10m và quay chuyển động chậm siêu mượt 400fps.',
    specs: {
      'Cảm biến': '1/1.9 inch CMOS',
      'Độ phân giải video': '5.3K/60fps, 4K/120fps, 720p/400fps',
      'Chống nước': '10 mét không cần vỏ',
      'Chống rung': 'HyperSmooth 6.0 + Khóa đường chân trời 360',
      'Pin': 'Enduro 1900mAh',
    },
    accessories_included: [
      'Máy GoPro Hero 13',
      '2 viên pin Enduro chính hãng',
      'Đốc sạc đôi',
      'Phao nổi tay cầm khi tắm biển',
      'Ngàm gắn nón bảo hiểm xe máy',
      'Thẻ nhớ 128GB SanDisk Extreme',
    ],
    rental_price_per_day: 150000,
    deposit_amount: 2000000,
    primary_image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 10,
    status: 'ACTIVE',
    seo_title: 'Thuê GoPro Hero 13 Black Đi Biển, Phượt | Giá từ 150K/ngày | THUECAM',
    seo_description:
      'Thuê GoPro Hero 13 Black chính hãng giá rẻ từ 150.000đ/ngày. Đầy đủ phụ kiện phượt, lặn biển, 2 pin Enduro, chống nước 10m.',
    canonical_url: 'https://thuecam.vn/thiet-bi/gopro-hero-13-black',
    og_title: 'Thuê GoPro Hero 13 Black Đi Biển, Phượt | Giá từ 150K/ngày | THUECAM',
    og_description: 'Thuê GoPro Hero 13 Black chính hãng giá rẻ từ 150.000đ/ngày.',
    og_image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 4.8,
    review_count: 32,
  },
  {
    id: 'prod-insta360-x4',
    slug: 'insta360-x4',
    name: 'Insta360 X4 8K 360 Camera',
    sku: 'TC-INSTA-X4',
    brand_id: 'b-insta360',
    category_id: 'cat-action-camera',
    excerpt: 'Camera 360 độ quay video chuẩn điện ảnh 8K 30fps, gậy selfie tàng hình và khả năng reframe góc quay hậu kỳ không giới hạn.',
    description: 'Insta360 X4 giải phóng hoàn toàn tư duy quay phim: chỉ cần bấm máy, bạn có thể chọn mọi góc nhìn mong muốn khi dựng video.',
    specs: {
      'Độ phân giải 360': '8K/30fps, 5.7K/60fps, 4K/100fps',
      'Độ phân giải ảnh': '72MP 360 Photo',
      'Màn hình': '2.5 inch kính cường lực Gorilla Glass',
      'Chống rung': 'FlowState + Khóa chân trời 360 độ',
      'Chống nước': '10 mét',
    },
    accessories_included: [
      'Máy Insta360 X4',
      'Gậy tàng hình Invisible Selfie Stick 114cm',
      '2 viên pin dung lượng cao',
      'Ốp bảo vệ thấu kính chống trầy',
      'Thẻ nhớ Extreme Pro 128GB',
    ],
    rental_price_per_day: 180000,
    deposit_amount: 2500000,
    primary_image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 6,
    status: 'ACTIVE',
    seo_title: 'Thuê Insta360 X4 8K 360 Độ | Giá từ 180K/ngày | THUECAM',
    seo_description:
      'Dịch vụ thuê camera 360 Insta360 X4 quay video 8K góc nhìn vô tận. Kèm gậy tàng hình, 2 pin, thẻ nhớ tốc độ cao.',
    canonical_url: 'https://thuecam.vn/thiet-bi/insta360-x4',
    og_title: 'Thuê Insta360 X4 8K 360 Độ | Giá từ 180K/ngày | THUECAM',
    og_description: 'Dịch vụ thuê camera 360 Insta360 X4 quay video 8K góc nhìn vô tận.',
    og_image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 4.8,
    review_count: 19,
  },
  {
    id: 'prod-dji-mini-4-pro',
    slug: 'dji-mini-4-pro',
    name: 'DJI Mini 4 Pro Flycam (Combo 3 Pin + Tay RC 2)',
    sku: 'TC-DJI-M4P-C3P',
    brand_id: 'b-dji',
    category_id: 'cat-flycam',
    excerpt: 'Flycam dưới 249g cao cấp nhất với cảm biến vật cản đa hướng omnidirectional, quay video 4K/60fps HDR và quay dọc True Vertical.',
    description: 'Mini 4 Pro mang đến trải nghiệm bay an toàn tuyệt đối với cảm biến tránh chướng ngại vật 360 độ, truyền sóng O4 xa 20km.',
    specs: {
      'Trọng lượng': 'Dưới 249g (Không cần giấy phép bay tại nhiều quốc gia)',
      'Cảm biến hình ảnh': '1/1.3-inch CMOS f/1.7',
      'Độ phân giải': '4K/60fps HDR, 4K/100fps Slow Motion',
      'Cảm biến an toàn': 'Cảm biến vật cản đa hướng 360 độ',
      'Thời gian bay': 'Lên tới 34 phút / 1 pin (Bao gồm 3 pin tổng 100 phút)',
    },
    accessories_included: [
      'Máy bay DJI Mini 4 Pro',
      'Bộ điều khiển thông minh DJI RC 2 màn hình FHD siêu sáng',
      '3 viên pin Intelligent Flight Battery',
      'Hub sạc 2 chiều',
      'Bộ cánh dự phòng & bảo vệ cánh',
      'Túi đeo chéo chính hãng',
      'Thẻ nhớ SanDisk 128GB V30',
    ],
    rental_price_per_day: 280000,
    deposit_amount: 4000000,
    primary_image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 5,
    status: 'ACTIVE',
    seo_title: 'Thuê Flycam DJI Mini 4 Pro Combo 3 Pin | Giá từ 280K/ngày | THUECAM',
    seo_description:
      'Thuê flycam DJI Mini 4 Pro tay cầm màn hình RC 2, 3 pin bay thả ga. Cảm biến vật cản an toàn, quay dọc TikTok 4K HDR.',
    canonical_url: 'https://thuecam.vn/thiet-bi/dji-mini-4-pro',
    og_title: 'Thuê Flycam DJI Mini 4 Pro Combo 3 Pin | Giá từ 280K/ngày | THUECAM',
    og_description: 'Thuê flycam DJI Mini 4 Pro tay cầm màn hình RC 2, 3 pin bay thả ga.',
    og_image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 5.0,
    review_count: 22,
  },
  {
    id: 'prod-dji-mic-2',
    slug: 'dji-mic-2',
    name: 'DJI Mic 2 (2 TX + 1 RX + Hộp Sạc)',
    sku: 'TC-DJI-MIC2',
    brand_id: 'b-dji',
    category_id: 'cat-micro',
    excerpt: 'Micro thu âm không dây cao cấp ghi âm 32-bit Float, khử ồn thông minh AI và kết nối trực tiếp Bluetooth với điện thoại.',
    description: 'DJI Mic 2 là giải pháp thu âm chuẩn phát thanh hoàn hảo, loại bỏ hoàn toàn hiện tượng méo tiếng với công nghệ ghi âm nội bộ 32-bit float.',
    specs: {
      'Cấu hình': '2 bộ phát (Transmitter) + 1 bộ thu (Receiver) + Hộp sạc',
      'Ghi âm nội bộ': 'Bộ nhớ trong 8GB, hỗ trợ 32-bit Float',
      'Khoảng cách truyền': 'Lên tới 250m',
      'Thời lượng pin': '6 giờ / 1 mic (Tổng 18 giờ kèm hộp sạc)',
    },
    accessories_included: [
      '2 Transmitter DJI Mic 2',
      '1 Receiver DJI Mic 2',
      'Hộp sạc kim loại thông minh',
      '2 bông lọc gió lông cừu',
      'Adapter kết nối Lightning và Type-C cho iPhone / Android',
      'Cáp 3.5mm TRS cho máy ảnh',
    ],
    rental_price_per_day: 120000,
    deposit_amount: 1500000,
    primary_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 15,
    status: 'ACTIVE',
    seo_title: 'Thuê Micro Không Dây DJI Mic 2 Khử Ồn AI | Giá từ 120K/ngày | THUECAM',
    seo_description:
      'Dịch vụ cho thuê micro không dây DJI Mic 2 (2 mic 1 thu) kèm hộp sạc. Ghi âm 32-bit float không vỡ tiếng, tương thích mọi điện thoại & máy ảnh.',
    canonical_url: 'https://thuecam.vn/thiet-bi/dji-mic-2',
    og_title: 'Thuê Micro Không Dây DJI Mic 2 Khử Ồn AI | Giá từ 120K/ngày | THUECAM',
    og_description: 'Dịch vụ cho thuê micro không dây DJI Mic 2 (2 mic 1 thu) kèm hộp sạc.',
    og_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 4.9,
    review_count: 37,
  },
  {
    id: 'prod-dji-rs-4-gimbal',
    slug: 'dji-rs-4-gimbal',
    name: 'DJI RS 4 Gimbal Chống Rung Máy Ảnh',
    sku: 'TC-DJI-RS4',
    brand_id: 'b-dji',
    category_id: 'cat-gimbal',
    excerpt: 'Gimbal chống rung chuyên nghiệp thế hệ 4 với khóa trục tự động Gen 2, thuật toán ổn định mượt mà hơn và tải trọng 3kg.',
    description: 'DJI RS 4 nâng tầm những thước phim cinematic của bạn với khả năng cân bằng nhanh, hỗ trợ quay dọc native và điều khiển màn trập Bluetooth không dây.',
    specs: {
      'Tải trọng tối đa': '3.0 kg (Phù hợp Sony A7 IV, FX3 kèm lens 24-70 GM)',
      'Thời lượng pin': '12 giờ hoạt động liên tục',
      'Màn hình': 'OLED cảm ứng hiển thị trạng thái',
      'Khóa trục': 'Khóa trục tự động thế hệ 2',
    },
    accessories_included: [
      'Thân gimbal DJI RS 4',
      'Tay nắm pin BG21',
      'Đế tháo nhanh Arca-Swiss',
      'Chân ba chân kim loại mini',
      'Bộ cáp điều khiển máy ảnh đa năng',
      'Hộp vali xốp chống sốc',
    ],
    rental_price_per_day: 160000,
    deposit_amount: 2000000,
    primary_image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop',
    ],
    inventory_count: 7,
    status: 'ACTIVE',
    seo_title: 'Thuê Gimbal Chống Rung DJI RS 4 Máy Ảnh | Giá từ 160K/ngày | THUECAM',
    seo_description:
      'Cho thuê gimbal máy ảnh DJI RS 4 chịu tải 3kg, khóa trục tự động, chống rung mượt mà. Đầy đủ phụ kiện cân máy tại showroom.',
    canonical_url: 'https://thuecam.vn/thiet-bi/dji-rs-4-gimbal',
    og_title: 'Thuê Gimbal Chống Rung DJI RS 4 Máy Ảnh | Giá từ 160K/ngày | THUECAM',
    og_description: 'Cho thuê gimbal máy ảnh DJI RS 4 chịu tải 3kg, khóa trục tự động.',
    og_image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    rating: 4.9,
    review_count: 14,
  },
];

export const ARTICLES: Article[] = [
  // Pillar page
  {
    id: 'art-pillar-thue-camera-du-lich',
    slug: 'thue-camera-du-lich',
    type: 'landing',
    title: 'Dịch Vụ Cho Thuê Camera Du Lịch Trọn Gói Giá Rẻ',
    excerpt: 'Tổng hợp các dòng máy quay du lịch, bỏ túi, chống nước từ DJI, GoPro, Insta360 kèm kinh nghiệm lựa chọn và thủ tục thuê nhanh nhất.',
    content: `## Tại Sao Nên Thuê Camera Khi Đi Du Lịch Thay Vì Mua?

Mỗi năm bạn thường chỉ đi du lịch hoặc công tác 2 - 3 lần. Việc bỏ ra 10 - 20 triệu đồng để sở hữu một chiếc máy quay đời mới thường dẫn đến lãng phí thiết bị khi để tủ.

Dịch vụ thuê camera du lịch tại **THUECAM** mang lại giải pháp tối ưu:
1. **Luôn tiếp cận máy mới nhất**: Bạn có thể trải nghiệm DJI Pocket 4, Pocket 3, GoPro 13 hay Insta360 X4 mà không lo mất giá thiết bị.
2. **Tiết kiệm tới 90% chi phí**: Chỉ từ 150K - 200K/ngày cho toàn bộ combo máy và phụ kiện.
3. **Đầy đủ phụ kiện kèm theo**: Pin dự phòng, thẻ nhớ tốc độ cao, gậy kéo dài, ngàm chống nước đều được trang bị sẵn.

---

## Nên Chọn Dòng Camera Nào Cho Chuyến Đi Của Bạn?

- **Đi biển, lặn san hô, leo núi mạo hiểm**: Hãy chọn [GoPro Hero 13 Black](/thiet-bi/gopro-hero-13-black) - chống va đập, chống nước trực tiếp 10 mét.
- **Quay vlog đời sống, dạo phố, ẩm thực, check-in**: Lựa chọn số 1 là [DJI Pocket 4 Creator](/thiet-bi/dji-pocket-4-creator) hoặc [DJI Pocket 3](/thiet-bi/dji-pocket-3-creator) với gimbal 3 trục cực kỳ êm ái.
- **Quay toàn cảnh 360 độ, video flycam giả lập**: [Insta360 X4 8K](/thiet-bi/insta360-x4) cho góc quay không giới hạn.`,
    featured_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
    author_name: 'Minh Tuấn (Trưởng nhóm Kỹ thuật THUECAM)',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    author_bio: 'Chuyên gia thiết bị quay chụp với hơn 7 năm kinh nghiệm thử nghiệm thực tế các dòng máy quay hành trình và gimbal.',
    reviewer_name: 'Hoàng Long (Founder THUECAM)',
    pillar_slug: 'thue-camera-du-lich',
    related_product_ids: ['prod-dji-pocket-4-creator', 'prod-gopro-hero-13-black', 'prod-insta360-x4'],
    status: 'PUBLISHED',
    seo_title: 'Thuê Camera Du Lịch Chính Hãng | Giá Chỉ Từ 150K/ngày | THUECAM',
    seo_description:
      'Dịch vụ cho thuê camera du lịch bỏ túi, action cam đi biển, chống nước chính hãng giá tốt tại TP.HCM & Hà Nội. Đặt thuê online nhận máy ngay.',
    canonical_url: 'https://thuecam.vn/thue-camera-du-lich',
    og_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    published_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },

  // Supporting cluster articles
  {
    id: 'art-dji-pocket-4-la-gi',
    slug: 'dji-pocket-4-la-gi',
    type: 'blog',
    title: 'DJI Pocket 4 là gì? Có phù hợp để quay vlog du lịch không?',
    excerpt: 'Đánh giá chi tiết DJI Pocket 4: Những cải tiến đáng giá so với đời tiền nhiệm và lý do vì sao chiếc máy này đang là lựa chọn số 1 cho các vlogger.',
    content: `DJI Pocket 4 là mẫu máy quay mini thế hệ mới nhất của DJI, tiếp nối sự thành công vang dội của Pocket 3.

### Các cải tiến nổi bật:
1. **Chất lượng hình ảnh trong đêm**: Nhờ thuật toán xử lý ảnh thế hệ mới, hiện tượng nhiễu hạt ở điều kiện ánh sáng yếu đã được giảm thiểu rõ rệt.
2. **Tốc độ khởi động siêu tốc**: Chỉ cần xoay màn hình ngang hoặc nhấn nút nguồn, máy đã sẵn sàng ghi hình trong chưa đầy 1 giây.
3. **Độ ổn định của gimbal**: Gimbal 3 trục giữ thăng bằng hoàn hảo khi di chuyển trên địa hình gập ghềnh.

Bạn có thể tham khảo thuê máy tại: [DJI Pocket 4 Creator Combo](/thiet-bi/dji-pocket-4-creator) hoặc xem thêm cẩm nang [Thuê camera du lịch](/thue-camera-du-lich).`,
    featured_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop',
    author_name: 'Minh Tuấn',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    author_bio: 'Reviewer thiết bị công nghệ tại THUECAM.',
    reviewer_name: 'Hoàng Long',
    pillar_slug: 'thue-camera-du-lich',
    related_product_ids: ['prod-dji-pocket-4-creator', 'prod-dji-pocket-3-creator'],
    status: 'PUBLISHED',
    seo_title: 'DJI Pocket 4 Là Gì? Có Nên Thuê Quay Vlog Không? | THUECAM',
    seo_description:
      'Đánh giá thực tế DJI Pocket 4: thông số, tính năng quay đêm, độ chống rung và lời khuyên có nên thuê máy để quay vlog du lịch.',
    canonical_url: 'https://thuecam.vn/blog/dji-pocket-4-la-gi',
    og_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    published_at: '2026-09-05T09:00:00Z',
    updated_at: '2026-09-18T14:00:00Z',
  },

  {
    id: 'art-comp-pocket-4-vs-pocket-3',
    slug: 'dji-pocket-4-vs-pocket-3',
    type: 'comparison',
    title: 'DJI Pocket 4 vs Pocket 3: Nên thuê máy nào cho chuyến đi?',
    excerpt: 'So sánh trực diện 2 thế hệ camera bỏ túi đỉnh nhất của DJI: khác biệt về cảm biến, mic thu âm, thời lượng pin và mức giá thuê.',
    content: `Cả hai thiết bị đều là những tuyệt tác kỹ thuật của DJI. Vậy giữa Pocket 4 và Pocket 3, đâu là lựa chọn thông minh nhất cho chuyến đi của bạn?

| Tiêu chí | DJI Pocket 4 Creator | DJI Pocket 3 Creator |
| :--- | :--- | :--- |
| **Giá thuê/ngày** | 200.000đ/ngày | 180.000đ/ngày |
| **Cảm biến** | 1-inch Thế hệ mới | 1-inch CMOS |
| **Khởi động** | < 1 giây | ~ 1.5 giây |
| **Quay đêm** | Khử nhiễu AI nâng cao | Rất tốt |
| **Micro đi kèm** | DJI Mic thế hệ mới | DJI Mic 2 |

### Lời khuyên chọn thuê:
- Nếu bạn quay nhiều vào buổi tối, ánh sáng phức tạp hoặc sự kiện cần bắt khoảnh khắc nhanh: Hãy chọn [DJI Pocket 4 Creator](/thiet-bi/dji-pocket-4-creator).
- Nếu bạn quay ban ngày, du lịch thông thường và muốn tiết kiệm chi phí tối đa: [DJI Pocket 3 Creator](/thiet-bi/dji-pocket-3-creator) là sự lựa chọn không thể hợp lý hơn.`,
    featured_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    author_name: 'Minh Tuấn',
    author_bio: 'Reviewer thiết bị công nghệ tại THUECAM.',
    pillar_slug: 'thue-camera-du-lich',
    related_product_ids: ['prod-dji-pocket-4-creator', 'prod-dji-pocket-3-creator'],
    status: 'PUBLISHED',
    seo_title: 'So Sánh DJI Pocket 4 vs Pocket 3: Nên Thuê Máy Nào? | THUECAM',
    seo_description:
      'Bảng so sánh chi tiết DJI Pocket 4 và Pocket 3: chất lượng quay đêm, gimbal, pin và chênh lệch giá thuê giúp bạn chọn máy ưng ý.',
    canonical_url: 'https://thuecam.vn/so-sanh/dji-pocket-4-vs-pocket-3',
    og_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    published_at: '2026-09-08T08:00:00Z',
    updated_at: '2026-09-19T10:00:00Z',
  },

  {
    id: 'art-guide-pocket-4-quay-du-lich',
    slug: 'dji-pocket-4-quay-du-lich',
    type: 'guide',
    title: 'Hướng dẫn cài đặt DJI Pocket 4 quay du lịch sắc nét từ A-Z',
    excerpt: 'Bí quyết thiết lập màu sắc D-Log M, tốc độ màn trập 180 độ, chống rung gimbal và cách sạc pin tối ưu cho cả ngày vi vu.',
    content: `Sau khi nhận máy tại THUECAM, đây là 4 bước cài đặt nhanh giúp bạn có ngay những thước phim chuẩn điện ảnh:

1. **Chọn profile màu D-Log M 10-bit**: Cho phép giữ lại nhiều chi tiết bầu trời và khuôn mặt để dễ dàng áp dụng filter màu sau đó.
2. **Quy tắc tốc độ màn trập 180 độ**: Nếu quay 4K 30fps, hãy để Shutter Speed ở mức 1/60s. Kết hợp kính lọc ND tặng kèm khi thuê máy tại THUECAM để hình ảnh không bị chói gắt.
3. **Thiết lập chế độ theo dõi ActiveTrack**: Chạm đúp vào mặt người cần theo dõi để máy tự động lia gimbal bám theo bạn trong mọi góc máy.

Xem thêm các bài viết liên quan:
- [Pillar: Dịch vụ thuê camera du lịch](/thue-camera-du-lich)
- [So sánh Pocket 4 và Pocket 3](/so-sanh/dji-pocket-4-vs-pocket-3)
- [Sản phẩm: DJI Pocket 4 Creator Combo](/thiet-bi/dji-pocket-4-creator)`,
    featured_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop',
    author_name: 'Hoàng Long',
    author_bio: 'Nhà làm phim độc lập & Giám đốc kỹ thuật THUECAM.',
    pillar_slug: 'thue-camera-du-lich',
    related_product_ids: ['prod-dji-pocket-4-creator'],
    status: 'PUBLISHED',
    seo_title: 'Hướng Dẫn Cài Đặt DJI Pocket 4 Quay Du Lịch Sắc Nét | THUECAM',
    seo_description:
      'Cẩm nang chi tiết cách cài đặt màu D-Log M, góc quay, tốc độ màn trập và mic không dây trên DJI Pocket 4 cho người mới bắt đầu.',
    canonical_url: 'https://thuecam.vn/huong-dan/dji-pocket-4-quay-du-lich',
    og_image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop',
    indexable: true,
    published_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-20T16:00:00Z',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-dji-pocket-4-creator',
    user_name: 'Nguyễn Thanh Tùng (Vlogger)',
    rating: 5,
    comment: 'Máy DJI Pocket 4 quay cực kỳ mượt mà. Mình thuê đi Đà Lạt 4 ngày, máy mới 99%, nhân viên THUECAM hỗ trợ cài đặt sẵn profile màu và tặng kèm thẻ nhớ 128GB cực nhanh.',
    rental_verified: true,
    status: 'APPROVED',
    created_at: '2026-09-12T14:30:00Z',
  },
  {
    id: 'rev-2',
    product_id: 'prod-dji-pocket-4-creator',
    user_name: 'Lê Hoàng Yến',
    rating: 5,
    comment: 'Dịch vụ giao nhận tại Quận 1 nhanh trong 30 phút. Mic đi kèm bắt tiếng rõ kể cả khi gió to bên bờ biển. Rất hài lòng với trải nghiệm thuê máy!',
    rental_verified: true,
    status: 'APPROVED',
    created_at: '2026-09-15T09:15:00Z',
  },
  {
    id: 'rev-3',
    product_id: 'prod-gopro-hero-13-black',
    user_name: 'Trần Quốc Bảo (Phượt Thủ)',
    rating: 5,
    comment: 'GoPro 13 chống rung HyperSmooth quá đỉnh. Mình gắn trên nón bảo hiểm chạy cung Tây Bắc đường xóc nhưng video vẫn êm như lướt. 2 pin Enduro đủ dùng cả ngày.',
    rental_verified: true,
    status: 'APPROVED',
    created_at: '2026-09-14T18:00:00Z',
  },
  {
    id: 'rev-4',
    product_id: 'prod-dji-mini-4-pro',
    user_name: 'Vũ Mạnh Hùng',
    rating: 5,
    comment: 'Tay cầm RC 2 màn hình sáng rực nhìn rõ dưới trời nắng gắt. Cảm biến tránh vật cản giúp người mới như mình tự tin bay quay cảnh vịnh Hạ Long.',
    rental_verified: true,
    status: 'APPROVED',
    created_at: '2026-09-16T11:20:00Z',
  },
];

export const REDIRECTS: RedirectRule[] = [
  {
    id: 'redir-1',
    old_url: '/thue-pocket-4',
    new_url: '/thiet-bi/dji-pocket-4-creator',
    status_code: 301,
    is_active: true,
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'redir-2',
    old_url: '/thue-pocket-3',
    new_url: '/thiet-bi/dji-pocket-3-creator',
    status_code: 301,
    is_active: true,
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'redir-3',
    old_url: '/gopro-13',
    new_url: '/thiet-bi/gopro-hero-13-black',
    status_code: 301,
    is_active: true,
    created_at: '2026-09-01T00:00:00Z',
  },
];
