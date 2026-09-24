'use client';
import React, { useState } from 'react';
import { Product, Category, Brand } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  Save,
  Camera,
  Layers,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Check,
} from 'lucide-react';
import { deleteAdminRecord, saveAdminRecord } from '@/lib/data/admin-api';
import { compressImageToBase64 } from '@/lib/utils/image-compress';
import SafeButton from '@/components/common/SafeButton';
import { isValidPositiveNumber } from '@/lib/security/validation';

export default function ProductManagerClient({
  initialProducts,
  categories,
  brands,
}: {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [rentalPrice, setRentalPrice] = useState<number>(250000);
  const [depositAmount, setDepositAmount] = useState<number>(3000000);
  const [primaryImage, setPrimaryImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ARCHIVED'>('ACTIVE');
  const [toastMsg, setToastMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');


  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setBrandId(brands[0]?.id || '');
    setRentalPrice(250000);
    setDepositAmount(3000000);
    setPrimaryImage('');
    setExcerpt('Bộ máy quay nhỏ gọn kèm đầy đủ thẻ nhớ và phụ kiện, nhận máy tại ETown Tân Bình.');
    setStatus('ACTIVE');
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategoryId(prod.category_id || '');
    setBrandId(prod.brand_id || '');
    setRentalPrice(prod.rental_price_per_day);
    setDepositAmount(prod.deposit_amount);
    setPrimaryImage(prod.primary_image);
    setExcerpt(prod.excerpt);
    setStatus(prod.status);
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn một file hình ảnh (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Kích thước file ảnh tối đa là 8MB');
      return;
    }

    setIsUploading(true);
    setValidationError('');
    try {
      const base64DataUrl = await compressImageToBase64(file, 1200, 1200, 0.85);
      setPrimaryImage(base64DataUrl);
      showToast('Đã nạp ảnh thành công! Sẵn sàng lưu vào CSDL');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi đọc file ảnh';
      showToast(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Input Validation
    if (!name.trim()) {
      setValidationError('Vui lòng nhập tên thiết bị');
      return;
    }
    if (!rentalPrice || rentalPrice <= 0) {
      setValidationError('Giá thuê phải lớn hơn 0 VNĐ');
      return;
    }
    if (depositAmount < 0) {
      setValidationError('Tiền cọc không được là số âm');
      return;
    }
    if (!primaryImage) {
      setValidationError('Vui lòng tải lên ảnh thiết bị từ máy tính để lưu vào CSDL');
      return;
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = categories.find((c) => c.id === categoryId);
    const brand = brands.find((b) => b.id === brandId);

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug: finalSlug,
      name,
      sku: editingProduct?.sku || `SKU-${Date.now()}`,
      category_id: categoryId,
      brand_id: brandId,
      category,
      brand,
      rental_price_per_day: Number(rentalPrice),
      deposit_amount: Number(depositAmount),
      primary_image: primaryImage,
      gallery_images: editingProduct?.gallery_images || [primaryImage],
      excerpt,
      description: editingProduct?.description || excerpt,
      features: editingProduct?.features || ['Cảm biến 1-inch', 'Chống rung 3 trục', 'Tặng thẻ 128GB'],
      accessories_included: editingProduct?.accessories_included || editingProduct?.included_accessories || ['Thẻ nhớ SanDisk Extreme 128GB', '2x Pin sạc đầy', 'Hộp chống sốc'],
      included_accessories: editingProduct?.included_accessories || ['Thẻ nhớ SanDisk Extreme 128GB', '2x Pin sạc đầy', 'Hộp chống sốc'],
      inventory_count: editingProduct?.inventory_count || 1,
      specs: editingProduct?.specs || { 'Độ phân giải': '4K/60fps', 'Cảm biến': '1 inch CMOS', 'Trọng lượng': '179g' },
      status,
      indexable: true,
      seo_title: editingProduct?.seo_title || `Thuê ${name} Giá Rẻ Tại TP.HCM | THUECAM`,
      seo_description: editingProduct?.seo_description || excerpt,
      created_at: editingProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const payload = {
      slug: productData.slug,
      name: productData.name,
      sku: productData.sku,
      category_id: productData.category_id || null,
      brand_id: productData.brand_id || null,
      excerpt: productData.excerpt,
      description: productData.description,
      rental_price_per_day: productData.rental_price_per_day,
      deposit_amount: productData.deposit_amount,
      primary_image: productData.primary_image,
      gallery_images: productData.gallery_images,
      inventory_count: productData.inventory_count,
      status: productData.status,
      indexable: productData.indexable,
    };

    try {
      const saved = await saveAdminRecord<Product>('products', {
        ...payload,
        id: productData.id,
        description: productData.description,
        specs: productData.specs,
        accessories_included: productData.accessories_included,
        seo_title: productData.seo_title,
        seo_description: productData.seo_description,
        canonical_url: productData.canonical_url,
        og_title: productData.og_title,
        og_description: productData.og_description,
        og_image: productData.og_image,
        created_at: productData.created_at,
        updated_at: productData.updated_at,
      });
      const savedProduct = { ...productData, ...saved, brand, category } as Product;
      setProducts((current) => editingProduct
        ? current.map((item) => item.id === editingProduct.id ? savedProduct : item)
        : [savedProduct, ...current]);
      setIsModalOpen(false);
      showToast(editingProduct ? `Đã cập nhật máy "${name}"` : `Đã thêm mới thiết bị "${name}"`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể lưu thiết bị.');
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa thiết bị "${prodName}" khỏi hệ thống?`)) return;
    try {
      await deleteAdminRecord('products', id);
      setProducts((current) => current.filter((item) => item.id !== id));
      showToast(`Đã xóa thiết bị "${prodName}"`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể xóa thiết bị.');
    }
  };

  const handleToggleStatus = async (prod: Product) => {
    const nextStatus = prod.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await saveAdminRecord('products', { id: prod.id, status: nextStatus }, 'update');
      setProducts((current) => current.map((item) => item.id === prod.id ? { ...item, status: nextStatus } : item));
      showToast(`Đã chuyển trạng thái sang ${nextStatus}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể đổi trạng thái.');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || p.category_id === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-500 text-slate-950 font-black px-5 py-3 shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom">
          <CheckCircle2 className="size-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên máy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-56"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
            <Filter className="size-3.5 text-sky-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Tất cả danh mục ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Product Button */}
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2.5 text-xs font-black shadow-md transition"
        >
          <Plus className="size-4" /> Thêm Thiết Bị Mới
        </button>
      </div>

      {/* Products Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Thiết bị</th>
                <th className="px-4 py-3.5">Danh mục</th>
                <th className="px-4 py-3.5">Hãng</th>
                <th className="px-4 py-3.5">Giá 1 ngày</th>
                <th className="px-4 py-3.5">Giá 3 ngày (-10%)</th>
                <th className="px-4 py-3.5">Tiền cọc</th>
                <th className="px-4 py-3.5">Trạng th��i</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredProducts.map((p) => {
                const catName = categories.find((c) => c.id === p.category_id)?.name || 'Chưa gán';
                const brandName = brands.find((b) => b.id === p.brand_id)?.name || 'Khác';
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Image & Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primary_image}
                          alt={p.name}
                          className="size-10 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">slug: {p.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                        {catName}
                      </span>
                    </td>

                    {/* Brand */}
                    <td className="px-4 py-3">
                      <span className="text-slate-400 font-bold">{brandName}</span>
                    </td>

                    {/* Price 1 day */}
                    <td className="px-4 py-3 font-black text-sky-400">
                      {p.rental_price_per_day.toLocaleString('vi-VN')}đ
                    </td>

                    {/* Price 3 days */}
                    <td className="px-4 py-3 text-slate-400">
                      {Math.round(p.rental_price_per_day * 0.9).toLocaleString('vi-VN')}đ
                    </td>

                    {/* Deposit */}
                    <td className="px-4 py-3 text-amber-400 font-medium">
                      {p.deposit_amount.toLocaleString('vi-VN')}đ
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black transition-all ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                        title="Click để đổi trạng thái"
                      >
                        {p.status === 'ACTIVE' ? 'Sẵn sàng' : 'Tạm dừng'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
                          title="Sửa máy"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Xóa máy"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Edit / Create Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Camera className="size-4 text-sky-400" />
                {editingProduct ? 'Chỉnh Sửa Thiết Bị' : 'Thêm Thiết Bị Mới Vào Kho'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Tên thiết bị: *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: DJI Pocket 4 Creator Combo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Slug URL (tùy chọn):</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="dji-pocket-4-creator"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-sky-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Danh mục: *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-bold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Giá thuê 1 ngày (VNĐ): *</label>
                  <input
                    type="number"
                    required
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sky-400 font-black text-sm outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Tiền cọc định mức (VNĐ): *</label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-amber-400 font-black text-sm outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Validation Error Alert */}
              {validationError && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300 font-bold">
                  {validationError}
                </div>
              )}

              {/* Image Upload Area (Stores in DB, allows local upload) */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Ảnh đại diện thiết bị (Lưu trực tiếp vào CSDL): *</span>
                  {primaryImage && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="size-3" /> Đã có dữ liệu ảnh trong CSDL
                    </span>
                  )}
                </label>

                <input
                  type="file"
                  id="product-file-input"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {primaryImage ? (
                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3.5 space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Image Preview */}
                      <div className="relative h-20 w-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={primaryImage}
                          alt="Xem trước ảnh sản phẩm"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          Ảnh thiết bị đã sẵn sàng lưu vào CSDL
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {primaryImage.startsWith('data:image')
                            ? 'Dữ liệu ảnh Base64 mã hóa trực tiếp trong Database'
                            : 'Đường dẫn ảnh'}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <label
                            htmlFor="product-file-input"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-[11px] cursor-pointer transition"
                          >
                            <UploadCloud className="size-3.5" /> Chọn ảnh khác từ máy
                          </label>
                          <button
                            type="button"
                            onClick={() => setPrimaryImage('')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[11px] transition"
                          >
                            <Trash2 className="size-3" /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="product-file-input"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                      isDragging
                        ? 'border-sky-400 bg-sky-500/10'
                        : 'border-slate-700 bg-slate-950/60 hover:border-sky-500/60 hover:bg-slate-900/60'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-sky-400">
                        <Loader2 className="size-8 animate-spin" />
                        <span className="text-xs font-bold">Đang nén và nạp dữ liệu ảnh...</span>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-full bg-sky-500/10 p-3 text-sky-400">
                          <UploadCloud className="size-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            Bấm để chọn ảnh từ máy tính hoặc kéo thả file vào đây
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Hỗ trợ JPG, PNG, WebP (Tự động nén chuẩn HD lưu trực tiếp vào CSDL, không cần link)
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Mô tả ngắn gọn: *</label>
                <textarea
                  rows={3}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Thương hiệu:</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Trạng thái:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-bold"
                  >
                    <option value="ACTIVE">ACTIVE (Sẵn sàng cho thuê)</option>
                    <option value="INACTIVE">INACTIVE (Tạm ẩn)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Đang bảo trì kỹ thuật)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <SafeButton
                  type="submit"
                  loadingText="Đang lưu vào CSDL..."
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-md"
                >
                  <Save className="size-4" /> Lưu Thiết Bị
                </SafeButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
