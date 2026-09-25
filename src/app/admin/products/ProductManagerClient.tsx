'use client';
import React, { useState } from 'react';
import { Product, Category, Brand, RentalAddon } from '@/types';
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
  UploadCloud,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { deleteAdminRecord, saveAdminRecord } from '@/lib/data/admin-api';
import { compressImageToBase64 } from '@/lib/utils/image-compress';
import SafeButton from '@/components/common/SafeButton';

async function uploadProductImage(imageDataUrl: string) {
  const imageBlob = await fetch(imageDataUrl).then((response) => response.blob());
  const formData = new FormData();
  formData.append('file', imageBlob, 'product-image');

  const response = await fetch('/api/admin/product-images', {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });
  const result = await response.json().catch(() => null) as { error?: string; path?: string; url?: string } | null;
  if (!response.ok || !result?.path || !result.url) {
    throw new Error(result?.error ?? 'Không thể tải ảnh sản phẩm lên kho lưu trữ.');
  }
  return { path: result.path, url: result.url };
}

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
  const [rentalAddonDrafts, setRentalAddonDrafts] = useState<RentalAddon[]>([]);
  const [uploadingAddonId, setUploadingAddonId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(3000000);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const primaryImage = galleryImages[0] ?? '';
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ARCHIVED'>('ACTIVE');
  const [hasInventory, setHasInventory] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setRentalAddonDrafts([]);
    setDepositAmount(3000000);
    setGalleryImages([]);
    setExcerpt('Bộ máy quay nhỏ gọn kèm đầy đủ thẻ nhớ và phụ kiện, nhận máy tại ETown Tân Bình.');
    setStatus('ACTIVE');
    setHasInventory(true);
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
    setRentalAddonDrafts((prod.rental_addons ?? []).map((addon) => ({
      ...addon,
      price_per_rental: Number(addon.price_per_rental ?? addon.price_per_day ?? 0),
    })));
    setDepositAmount(prod.deposit_amount);
    setGalleryImages([
      prod.primary_image,
      ...(prod.gallery_images ?? []).filter((image) => image && image !== prod.primary_image),
    ].filter(Boolean));
    setExcerpt(prod.excerpt);
    setStatus(prod.status);
    setHasInventory(prod.inventory_count > 0);
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    if (!selectedFiles.length || isUploading) return;

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/') && file.size <= 8 * 1024 * 1024,
    );
    const skippedCount = selectedFiles.length - validFiles.length;

    if (!validFiles.length) {
      showToast('Chỉ nhận file ảnh có dung lượng tối đa 8MB.');
      return;
    }

    setIsUploading(true);
    setValidationError('');
    try {
      const uploadedImages: string[] = [];
      for (const file of validFiles) {
        uploadedImages.push(await compressImageToBase64(file, 1000, 1000, 0.78));
      }
      setGalleryImages((current) => [...current, ...uploadedImages]);
      showToast(`Đã thêm ${uploadedImages.length} ảnh theo thứ tự chọn${skippedCount ? `, bỏ qua ${skippedCount} file không hợp lệ` : ''}.`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi đọc file ảnh';
      showToast(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const updateRentalAddon = (id: string, updates: Partial<RentalAddon>) => {
    setRentalAddonDrafts((current) => current.map((addon) => addon.id === id ? { ...addon, ...updates } : addon));
  };

  const handleAddonImageUpload = async (id: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn một file hình ảnh.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Kích thước ảnh phụ kiện tối đa là 8MB.');
      return;
    }

    setUploadingAddonId(id);
    try {
      const image = await compressImageToBase64(file, 900, 900, 0.82);
      updateRentalAddon(id, { image });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể đọc ảnh phụ kiện.');
    } finally {
      setUploadingAddonId(null);
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

    const namedAddons = rentalAddonDrafts.filter((addon) => addon.name.trim());
    const rentalAddons = namedAddons.map((addon, index) => {
      const id = addon.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `accessory-${index + 1}`;
      return {
        id,
        name: addon.name.trim(),
        description: addon.description?.trim() ?? '',
        image: addon.image ?? '',
        price_per_rental: Number(addon.price_per_rental),
      };
    });
    if (rentalAddons.some((addon) => !Number.isSafeInteger(addon.price_per_rental) || addon.price_per_rental <= 0)) {
      setValidationError('Mỗi phụ kiện cần có giá thuê một lần là số nguyên lớn hơn 0 VNĐ.');
      return;
    }
    if (new Set(rentalAddons.map((addon) => addon.id)).size !== rentalAddons.length) {
      setValidationError('Tên phụ kiện cần khác nhau để không bị trùng lựa chọn.');
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
      rental_addons: rentalAddons,
      deposit_amount: Number(depositAmount),
      primary_image: primaryImage,
      gallery_images: galleryImages,
      excerpt,
      description: editingProduct?.description || excerpt,
      features: editingProduct?.features || ['Cảm biến 1-inch', 'Chống rung 3 trục', 'Tặng thẻ 128GB'],
      accessories_included: editingProduct?.accessories_included || editingProduct?.included_accessories || ['Thẻ nhớ SanDisk Extreme 128GB', '2x Pin sạc đầy', 'Hộp chống sốc'],
      included_accessories: editingProduct?.included_accessories || ['Thẻ nhớ SanDisk Extreme 128GB', '2x Pin sạc đầy', 'Hộp chống sốc'],
      inventory_count: hasInventory ? Math.max(editingProduct?.inventory_count ?? 1, 1) : 0,
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
      rental_addons: productData.rental_addons,
      deposit_amount: productData.deposit_amount,
      primary_image: productData.primary_image,
      gallery_images: productData.gallery_images,
      inventory_count: productData.inventory_count,
      status: productData.status,
      indexable: productData.indexable,
    };

    const uploadedImagePaths: string[] = [];
    setIsSaving(true);
    try {
      const persistedGalleryImages: string[] = [];
      for (const image of galleryImages) {
        if (image.startsWith('data:')) {
          const uploadedImage = await uploadProductImage(image);
          uploadedImagePaths.push(uploadedImage.path);
          persistedGalleryImages.push(uploadedImage.url);
        } else {
          persistedGalleryImages.push(image);
        }
      }

      const persistedRentalAddons: RentalAddon[] = [];
      for (const addon of rentalAddons) {
        if (addon.image.startsWith('data:')) {
          const uploadedImage = await uploadProductImage(addon.image);
          uploadedImagePaths.push(uploadedImage.path);
          persistedRentalAddons.push({ ...addon, image: uploadedImage.url });
        } else {
          persistedRentalAddons.push(addon);
        }
      }

      const savedProductData = {
        ...productData,
        primary_image: persistedGalleryImages[0] ?? '',
        gallery_images: persistedGalleryImages,
        rental_addons: persistedRentalAddons,
      };
      const saved = await saveAdminRecord<Product>('products', {
        ...payload,
        id: productData.id,
        primary_image: savedProductData.primary_image,
        gallery_images: savedProductData.gallery_images,
        rental_addons: savedProductData.rental_addons,
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
      const savedProduct = { ...savedProductData, ...saved, brand, category } as Product;
      setProducts((current) => editingProduct
        ? current.map((item) => item.id === editingProduct.id ? savedProduct : item)
        : [savedProduct, ...current]);
      setIsModalOpen(false);
      showToast(editingProduct ? `Đã cập nhật máy "${name}"` : `Đã thêm mới thiết bị "${name}"`);
    } catch (error) {
      if (uploadedImagePaths.length) {
        await fetch('/api/admin/product-images', {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: uploadedImagePaths }),
        }).catch(() => undefined);
      }
      showToast(error instanceof Error ? error.message : 'Không thể lưu thiết bị.');
    } finally {
      setIsSaving(false);
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
                <th className="px-4 py-3.5">Tình trạng máy</th>
                <th className="px-4 py-3.5">Trạng thái</th>
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

                    {/* Inventory */}
                    <td className="px-4 py-3">
                      {p.inventory_count > 0 ? (
                        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          Có máy ({p.inventory_count})
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                          Chưa có máy · Kín lịch
                        </span>
                      )}
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

              <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4" aria-labelledby="rental-accessories-heading">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 id="rental-accessories-heading" className="font-black text-white">Phụ kiện thuê thêm</h4>
                    <p className="mt-1 text-[10px] text-slate-400">Giá được cộng một lần cho toàn bộ đơn thuê, không nhân theo số ngày.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRentalAddonDrafts((current) => [...current, { id: `new-accessory-${Date.now()}`, name: '', price_per_rental: 0, description: '', image: '' }])}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-sky-500/15 px-3 py-2 text-[11px] font-black text-sky-300 hover:bg-sky-500/25"
                  >
                    <Plus className="size-3.5" /> Thêm phụ kiện
                  </button>
                </div>

                {rentalAddonDrafts.length ? rentalAddonDrafts.map((addon, index) => (
                  <div key={addon.id} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400" htmlFor={`addon-name-${index}`}>Tên phụ kiện</label>
                      <input
                        id={`addon-name-${index}`}
                        value={addon.name}
                        onChange={(event) => updateRentalAddon(addon.id, { name: event.target.value })}
                        placeholder="Ví dụ: Gimbal chống rung"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                      />
                      <label className="block text-[10px] font-bold text-slate-400" htmlFor={`addon-description-${index}`}>Mô tả</label>
                      <textarea
                        id={`addon-description-${index}`}
                        rows={2}
                        value={addon.description ?? ''}
                        onChange={(event) => updateRentalAddon(addon.id, { description: event.target.value })}
                        placeholder="Mô tả ngắn về phụ kiện"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                      />
                      <label className="block text-[10px] font-bold text-slate-400" htmlFor={`addon-price-${index}`}>Giá thuê một lần (VNĐ)</label>
                      <input
                        id={`addon-price-${index}`}
                        type="number"
                        min={1}
                        step={1}
                        value={addon.price_per_rental ?? addon.price_per_day ?? ''}
                        onChange={(event) => updateRentalAddon(addon.id, { price_per_rental: Number(event.target.value) })}
                        placeholder="150000"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-sky-300 outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="flex items-start gap-2 sm:flex-col">
                      {addon.image ? (
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-slate-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={addon.image} alt={`Ảnh ${addon.name || 'phụ kiện'}`} className="size-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-700 text-slate-500" aria-hidden="true">
                          <ImageIcon className="size-5" />
                        </div>
                      )}
                      <label className="cursor-pointer rounded-lg bg-slate-800 px-2.5 py-2 text-center text-[10px] font-bold text-slate-200 hover:bg-slate-700">
                        {uploadingAddonId === addon.id ? 'Đang tải…' : addon.image ? 'Đổi ảnh' : 'Tải ảnh'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="sr-only"
                          disabled={uploadingAddonId === addon.id}
                          onChange={(event) => {
                            void handleAddonImageUpload(addon.id, event.target.files?.[0]);
                            event.currentTarget.value = '';
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setRentalAddonDrafts((current) => current.filter((item) => item.id !== addon.id))}
                        className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10"
                        aria-label={`Xóa phụ kiện ${addon.name || index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )) : <p className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-center text-[11px] text-slate-500">Chưa có phụ kiện thuê thêm.</p>}
              </section>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tình trạng máy:</label>
                <select
                  value={hasInventory ? 'IN_STOCK' : 'NO_UNIT'}
                  onChange={(e) => setHasInventory(e.target.value === 'IN_STOCK')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-500 font-bold"
                >
                  <option value="IN_STOCK">Có máy, cho phép đặt theo lịch</option>
                  <option value="NO_UNIT">Chưa có máy — luôn kín lịch, không nhận đặt</option>
                </select>
                <p className="mt-1 text-[10px] text-slate-400">
                  Khi chọn “Chưa có máy”, lịch thuê sẽ kín toàn bộ ngày và hệ thống sẽ từ chối đơn đặt mới.
                </p>
              </div>

              {/* Validation Error Alert */}
              {validationError && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300 font-bold">
                  {validationError}
                </div>
              )}

              {/* Product image gallery */}
              <div>
                <label htmlFor="product-file-input" className="mb-1.5 block font-bold text-slate-300">
                  Ảnh thiết bị: * <span className="font-normal text-slate-400">Ảnh đầu tiên là ảnh đại diện</span>
                </label>
                <input
                  type="file"
                  id="product-file-input"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  disabled={isUploading || isSaving}
                  className="hidden"
                  onChange={(event) => {
                    const files = event.currentTarget.files;
                    if (files?.length) void handleImageUpload(files);
                    event.currentTarget.value = '';
                  }}
                />

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    if (event.dataTransfer.files.length) void handleImageUpload(event.dataTransfer.files);
                  }}
                  className={`rounded-2xl border-2 border-dashed p-3 transition ${
                    isDragging ? 'border-sky-400 bg-sky-500/10' : 'border-slate-700 bg-slate-950/60'
                  }`}
                >
                  {galleryImages.length > 0 ? (
                    <>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white" aria-live="polite">
                          {galleryImages.length} ảnh · Thứ tự hiển thị theo thứ tự thêm
                        </p>
                        <label
                          htmlFor="product-file-input"
                          className={`inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-3 py-1.5 text-[11px] font-bold text-sky-300 transition ${isUploading ? 'cursor-wait opacity-60' : 'cursor-pointer hover:bg-sky-500/30'}`}
                        >
                          {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <UploadCloud className="size-3.5" />}
                          {isUploading ? 'Đang nén ảnh...' : 'Thêm ảnh'}
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {galleryImages.map((image, index) => (
                          <div key={`${index}-${image.slice(0, 32)}`} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                            <div className="relative aspect-[4/3] bg-slate-950">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={image} alt={`Ảnh sản phẩm thứ ${index + 1}`} className="size-full object-contain" />
                              <span className="absolute left-2 top-2 rounded-md bg-slate-950/85 px-2 py-1 text-[10px] font-bold text-white">
                                {index === 0 ? 'Ảnh đại diện' : `Ảnh ${index + 1}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setGalleryImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                              aria-label={`Xóa ảnh thứ ${index + 1}`}
                              className="flex w-full items-center justify-center gap-1 border-t border-slate-700 px-2 py-2 text-[11px] font-bold text-rose-400 transition hover:bg-rose-500/10"
                            >
                              <Trash2 className="size-3.5" /> Xóa ảnh
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-[10px] text-slate-400" role="status">
                        {isUploading ? 'Đang nén và thêm ảnh theo thứ tự đã chọn…' : 'Có thể chọn nhiều ảnh cùng lúc hoặc kéo thả ảnh vào khu vực này.'}
                      </p>
                    </>
                  ) : (
                    <label
                      htmlFor="product-file-input"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-6 text-center"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-sky-400">
                          <Loader2 className="size-8 animate-spin" />
                          <span className="text-xs font-bold">Đang nén ảnh…</span>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-full bg-sky-500/10 p-3 text-sky-400">
                            <UploadCloud className="size-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Chọn hoặc kéo thả nhiều ảnh vào đây</p>
                            <p className="mt-1 text-[10px] text-slate-400">Ảnh được nén và thêm theo đúng thứ tự chọn · Tối đa 8MB mỗi ảnh</p>
                          </div>
                        </>
                      )}
                    </label>
                  )}
                </div>
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
                    onChange={(e) => setStatus(e.target.value as Product['status'])}
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
                  loadingText="Đang tải ảnh và lưu..."
                  isLoading={isSaving}
                  disabled={isUploading}
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
