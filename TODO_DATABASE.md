# TODO: Kiểm tra và thiết lập Supabase DB

## Tình trạng đã kiểm tra

- Home page đang đọc dữ liệu trực tiếp từ Supabase qua `src/lib/data/index.ts`; không thấy fallback dữ liệu sản phẩm hardcode ở luồng này.
- Trong Supabase đang kết nối với dự án này, lần kiểm tra gần nhất thấy: **7 products, 6 categories, 4 brands, 3 use_cases, 2 locations, 4 articles**. Vì vậy, database của dự án đang kết nối không trống.
- Nếu bảng trong Supabase bạn đang mở không có các dòng này, nhiều khả năng bạn đang xem **một Supabase project khác** với project mà Preview/app đang dùng.

## Việc cần làm

- [ ] So sánh project/ref của Supabase đang mở với `NEXT_PUBLIC_SUPABASE_URL` mà app/Preview dùng. Chỉ so sánh hostname/project ref; **không gửi hoặc dán API key, service-role key hay database password**.
- [ ] Trong đúng project đó, chạy truy vấn chỉ đọc sau để kiểm tra số dòng:

```sql
select 'products' as table_name, count(*) as row_count from public.products
union all select 'categories', count(*) from public.categories
union all select 'brands', count(*) from public.brands
union all select 'use_cases', count(*) from public.use_cases
union all select 'locations', count(*) from public.locations
union all select 'articles', count(*) from public.articles;
```

- [ ] Nếu các bảng có dữ liệu nhưng trang không hiển thị, xác nhận app đang dùng đúng môi trường Supabase và kiểm tra quyền `SELECT`/RLS cho role `anon`. Home page gọi Supabase bằng client phía server; dữ liệu công khai vẫn cần policy đọc phù hợp.
- [ ] Nếu **đúng project mà các bảng thực sự trống**, dừng trước khi chạy migration và xác định schema đích. Các file SQL trong repo có những phiên bản schema khác nhau: `01_initial_schema.sql` dùng ID kiểu UUID, trong khi app hiện dùng ID dạng text; không chạy tất cả file theo thứ tự một cách máy móc. `02_admin_catalog_data.sql` và `02_app_data.sql` cũng có phần tạo schema trùng nhau. `seed.sql` chứa dữ liệu catalog mẫu.
- [ ] Chỉ sau khi xác nhận đúng project và schema, áp dụng một bộ schema tương thích rồi seed catalog; sau đó chạy lại truy vấn đếm dòng ở trên.

## Tài khoản quản trị

Admin đăng nhập bằng Supabase Auth (email/mật khẩu); quyền quản trị được cấp riêng trong bảng `public.admin_users`. Bảng này bật RLS và chỉ server có service role mới đọc/ghi được. Không còn dùng `ADMIN_EMAIL` hoặc `ADMIN_PASSWORD`.

Để cấp quyền cho admin đầu tiên:

1. Tạo user email/mật khẩu trong Supabase Auth của project đang kết nối. Không tạo user bằng cách INSERT trực tiếp vào `auth.users`.
2. Chạy SQL sau, thay email bằng email vừa tạo:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('admin@example.com')
on conflict (user_id) do nothing;
```

Sau đó đăng nhập tại `/admin/login` bằng email và mật khẩu đó. Xóa dòng tương ứng khỏi `public.admin_users` để thu hồi quyền; các session hiện có cũng sẽ bị từ chối ở lần kiểm tra tiếp theo. Mật khẩu được Supabase Auth quản lý, không lưu trong bảng admin.

## Lưu ý

Các dòng hiện có là dữ liệu catalog mẫu trong Supabase, không phải booking hay review khách hàng thật. Không chạy lại hoặc xóa dữ liệu để xử lý nhầm project; trước tiên hãy kiểm tra project/ref mà app và SQL Editor đang trỏ tới.
