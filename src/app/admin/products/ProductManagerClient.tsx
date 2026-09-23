'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
  getStoredCategories,
} from '@/lib/data/admin-store';

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
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'>('ACTIVE');
  const [toastMsg, setToastMsg] = useState('');

  // Sync from localStorage on mount and listen to changes
  useEffect(() => {
    setProducts(getStoredProducts());

    const handleDataChanged = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('thuecam_data_changed', handleDataChanged);
    return () => window.removeEventListener('thuecam_data_changed', handleDataChanged);
  }, []);

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
    setPrimaryImage('https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=600&auto=format&fit=crop');
    setExcerpt('Bộ máy quay nhỏ gọn kèm đầy đủ thẻ nhớ và phụ kiện, nhận máy tại ETown Tân Bình.');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategoryId(prod.category_id);
    setBrandId(prod.brand_id);
    setRentalPrice(prod.rental_price_per_day);
    setDepositAmount(prod.deposit_amount);
    setPrimaryImage(prod.primary_image);
    setExcerpt(prod.excerpt);
    setStatus(prod.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = categories.find((c) => c.id === categoryId);
    const brand = brands.find((b) => b.id === brandId);

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug: finalSlug,
      name,
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
      included_accessories: editingProduct?.included_accessories || ['Thẻ nhớ SanDisk Extreme 128GB', '2x Pin sạc đầy', 'Hộp chống sốc'],
      specs: editingProduct?.specs || { 'Độ phân giải': '4K/60fps', 'Cảm biến': '1 inch CMOS', 'Trọng lượng': '179g' },
      status,
      indexable: true,
      seo_title: editingProduct?.seo_title || `Thuê ${name} Giá Rẻ Tại TP.HCM | THUECAM`,
      seo_description: editingProduct?.seo_description || excerpt,
      created_at: editingProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = saveStoredProduct(productData);
    setProducts(updated);
    setIsModalOpen(false);
    showToast(editingProduct ? `Đã cập nhật máy "${name}"` : `Đã thêm mới thiết bị "${name}"`);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Bạn có chắc muốn xóa thiết bị "${prodName}" khỏi hệ thống?`)) {
      const updated = deleteStoredProduct(id);
      setProducts(updated);
      showToast(`Đã xóa thiết bị "${prodName}"`);
    }
  };

  const handleToggleStatus = (prod: Product) => {
    const nextStatus = prod.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = saveStoredProduct({ ...prod, status: nextStatus });
    setProducts(updated);
    showToast(`Đã chuyển trạng thái sang ${nextStatus}`);
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

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL ảnh đại diện: *</label>
                <input
                  required
                  value={primaryImage}
                  onChange={(e) => setPrimaryImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-sky-500 font-mono text-[11px]"
                />
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
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-md"
                >
                  <Save className="size-4" /> Lưu Thiết Bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
