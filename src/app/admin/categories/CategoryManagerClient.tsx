'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { Plus, Edit, Trash2, Layers, CheckCircle2, X, Save } from 'lucide-react';
import {
  getStoredCategories,
  saveStoredCategory,
  deleteStoredCategory,
} from '@/lib/data/admin-store';

export default function CategoryManagerClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Camera');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setCategories(getStoredCategories());
    const handleDataChanged = () => setCategories(getStoredCategories());
    window.addEventListener('thuecam_data_changed', handleDataChanged);
    return () => window.removeEventListener('thuecam_data_changed', handleDataChanged);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('Dòng thiết bị chất lượng cao phục vụ sáng tạo nội dung.');
    setIcon('Camera');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setIcon(c.icon);
    setDisplayOrder(c.display_order);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const catData: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      slug: finalSlug,
      name,
      description,
      icon,
      display_order: Number(displayOrder),
      h1: editingCategory?.h1 || `Dịch Vụ Thuê ${name} Chính Hãng`,
      intro_content: editingCategory?.intro_content || description,
      indexable: true,
      seo_title: editingCategory?.seo_title || `Thuê ${name} Giá Rẻ Tại TP.HCM | THUECAM`,
      seo_description: editingCategory?.seo_description || description,
    };

    const updated = saveStoredCategory(catData);
    setCategories(updated);
    setIsModalOpen(false);
    showToast(editingCategory ? `Đã cập nhật danh mục "${name}"` : `Đã thêm danh mục "${name}"`);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Bạn có chắc muốn xóa danh mục "${catName}"?`)) {
      const updated = deleteStoredCategory(id);
      setCategories(updated);
      showToast(`Đã xóa danh mục "${catName}"`);
    }
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-500 text-slate-950 font-black px-5 py-3 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="size-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-400">
          Hiện có <strong className="text-white">{categories.length}</strong> danh mục thiết bị
        </p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 px-4 py-2.5 text-xs font-black shadow-md transition"
        >
          <Plus className="size-4" /> Thêm Danh Mục Mới
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Thứ tự</th>
              <th className="px-5 py-3.5">Tên danh mục</th>
              <th className="px-5 py-3.5">Slug URL</th>
              <th className="px-5 py-3.5">Mô tả</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-bold text-sky-400">#{c.display_order}</td>
                <td className="px-5 py-3.5 font-black text-white flex items-center gap-2">
                  <Layers className="size-4 text-indigo-400" />
                  <span>{c.name}</span>
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-400">{c.slug}</td>
                <td className="px-5 py-3.5 text-slate-400 max-w-sm truncate">{c.description}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
                      title="Sửa"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Xóa"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="size-4 text-indigo-400" />
                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
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
                <label className="block font-bold text-slate-300 mb-1">Tên danh mục: *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Camera Đi Biển"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Slug URL:</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="camera-di-bien"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Thứ tự hiển thị:</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Mô tả danh mục:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500"
                />
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
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black shadow-md"
                >
                  <Save className="size-4" /> Lưu Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
