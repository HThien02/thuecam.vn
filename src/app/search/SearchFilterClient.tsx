'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category, Brand } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/gtag';

interface Props {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
}

export default function SearchFilterClient({
  initialProducts,
  categories,
  brands,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // Name or excerpt match
      if (
        searchTerm &&
        !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'ALL' && p.category_id !== selectedCategory) {
        return false;
      }

      // Brand match
      if (selectedBrand !== 'ALL' && p.brand_id !== selectedBrand) {
        return false;
      }

      // Max price
      if (p.rental_price_per_day > maxPrice) {
        return false;
      }

      return true;
    });
  }, [initialProducts, searchTerm, selectedCategory, selectedBrand, maxPrice]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val.length > 2) {
      trackEvent({
        action: 'search',
        params: { search_term: val, results_count: filteredProducts.length },
      });
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setMaxPrice(500000);
  };

  return (
    <div className="space-y-8">
      {/* Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên máy (ví dụ: Pocket 4, GoPro, Mini 4 Pro...)"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Dropdowns & Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Danh mục:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Thương hiệu:</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span className="font-semibold">Giá tối đa / ngày:</span>
              <span className="text-cyan-400 font-bold">
                {new Intl.NumberFormat('vi-VN').format(maxPrice)}đ
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={500000}
              step={20000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Status count & reset */}
        <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-800">
          <span>
            Tìm thấy <strong className="text-white">{filteredProducts.length}</strong> thiết bị phù hợp.
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Filtered Results */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-3">
          <p className="text-slate-300 font-medium">Không tìm thấy thiết bị nào khớp với bộ lọc của bạn.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Xóa bộ lọc để xem lại toàn bộ máy
          </button>
        </div>
      )}
    </div>
  );
}
