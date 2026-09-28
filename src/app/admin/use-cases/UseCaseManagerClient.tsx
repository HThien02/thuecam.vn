'use client';

import { useState } from 'react';
import type { FAQItem, Product, UseCase } from '@/types';
import { deleteAdminRecord, saveAdminRecord } from '@/lib/data/admin-api';
import { Edit, ExternalLink, Plus, Save, Trash2, X } from 'lucide-react';

interface Props {
  initialUseCases: UseCase[];
  products: Product[];
  initialLinks: Record<string, string[]>;
}

const inputClass =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400';
const labelClass = 'block space-y-1.5 text-xs font-bold text-slate-300';

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function UseCaseManagerClient({ initialUseCases, products, initialLinks }: Props) {
  const [items, setItems] = useState(initialUseCases);
  const [links, setLinks] = useState(initialLinks);
  const [editing, setEditing] = useState<UseCase | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [h1, setH1] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [indexable, setIndexable] = useState(true);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);

  const openForm = (item: UseCase | null) => {
    setEditing(item);
    setName(item?.name ?? '');
    setSlug(item?.slug ?? '');
    setH1(item?.h1 ?? '');
    setContent(item?.content ?? '');
    setSeoTitle(item?.seo_title ?? '');
    setSeoDescription(item?.seo_description ?? '');
    setOgImage(item?.og_image ?? '');
    setIndexable(item?.indexable ?? true);
    setFaq(item?.faq ?? []);
    setProductIds(item ? links[item.id] ?? [] : []);
    setOpen(true);
  };

  const toggleProduct = (id: string) =>
    setProductIds((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));

  const updateFaq = (index: number, key: keyof FAQItem, value: string) =>
    setFaq((current) => current.map((entry, i) => (i === index ? { ...entry, [key]: value } : entry)));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const record = {
      id: editing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      slug: toSlug(slug || name),
      h1: h1.trim() || name.trim(),
      content: content.trim(),
      faq: faq.filter((entry) => entry.question.trim() && entry.answer.trim()),
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      og_image: ogImage.trim() || null,
      indexable,
    };
    try {
      const saved = await saveAdminRecord<UseCase>('use_cases', record, editing ? 'update' : 'create');
      const response = await fetch('/api/admin/use-case-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ useCaseId: saved.id, productIds }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? 'Đã lưu nhu cầu nhưng chưa gán được thiết bị.');
      }
      setItems((current) =>
        editing ? current.map((item) => (item.id === saved.id ? saved : item)) : [...current, saved],
      );
      setLinks((current) => ({ ...current, [saved.id]: productIds }));
      setOpen(false);
      setMessage('Đã lưu nhu cầu thuê.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: UseCase) => {
    if (!confirm(`Xóa nhu cầu "${item.name}"?`)) return;
    try {
      await deleteAdminRecord('use_cases', item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage('Đã xóa nhu cầu thuê.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể xóa.');
    }
  };

  return (
    <div className="space-y-5">
      {message && (
        <p role="status" className="rounded-xl bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-300">
          {message}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{items.length} nhu cầu thuê</p>
        <button
          onClick={() => openForm(null)}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-black text-slate-950"
        >
          <Plus className="size-4" /> Thêm nhu cầu
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
            <tr>
              <th className="px-5 py-4">Tên</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Thiết bị gợi ý</th>
              <th className="px-5 py-4">FAQ</th>
              <th className="px-5 py-4">Hiển thị</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4 font-black text-white">{item.name}</td>
                <td className="px-5 py-4 font-mono text-slate-400">/nhu-cau/{item.slug}</td>
                <td className="px-5 py-4 text-slate-300">{links[item.id]?.length ?? 0}</td>
                <td className="px-5 py-4 text-slate-300">{item.faq?.length ?? 0}</td>
                <td className="px-5 py-4 text-slate-300">{item.indexable ? 'Đang bật' : 'Đang tắt'}</td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <a
                    href={`/nhu-cau/${item.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mr-1 inline-flex rounded-lg p-2 text-slate-400"
                    aria-label={`Xem trang ${item.name}`}
                  >
                    <ExternalLink className="size-4" />
                  </a>
                  <button onClick={() => openForm(item)} className="mr-1 rounded-lg p-2 text-sky-300" aria-label={`Sửa ${item.name}`}>
                    <Edit className="size-4" />
                  </button>
                  <button onClick={() => remove(item)} className="rounded-lg p-2 text-rose-300" aria-label={`Xóa ${item.name}`}>
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  Chưa có nhu cầu thuê nào. Bấm &quot;Thêm nhu cầu&quot; để tạo mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
          <form
            onSubmit={save}
            className="my-8 w-full max-w-3xl space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">{editing ? 'Sửa nhu cầu thuê' : 'Thêm nhu cầu thuê'}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">
                <X className="text-slate-400" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                <span>Tên nhu cầu *</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span>Slug (để trống sẽ tự tạo)</span>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={toSlug(name)} className={inputClass} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span>Tiêu đề H1</span>
                <input value={h1} onChange={(e) => setH1(e.target.value)} placeholder={name} className={inputClass} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span>Nội dung giới thiệu</span>
                <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} className={inputClass} />
              </label>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-bold text-slate-300">
                Thiết bị gợi ý ({productIds.length} đã chọn)
              </legend>
              <div className="grid max-h-52 gap-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3 sm:grid-cols-2">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={productIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="size-4 accent-cyan-500"
                    />
                    <span className="truncate">{product.name}</span>
                  </label>
                ))}
                {products.length === 0 && <p className="text-xs text-slate-400">Chưa có thiết bị.</p>}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <div className="flex items-center justify-between">
                <legend className="text-xs font-bold text-slate-300">Câu hỏi thường gặp (FAQ)</legend>
                <button
                  type="button"
                  onClick={() => setFaq((current) => [...current, { question: '', answer: '' }])}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-cyan-300"
                >
                  <Plus className="size-3.5" /> Thêm câu hỏi
                </button>
              </div>
              {faq.map((entry, index) => (
                <div key={index} className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="flex gap-2">
                    <input
                      value={entry.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Câu hỏi"
                      aria-label={`Câu hỏi ${index + 1}`}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setFaq((current) => current.filter((_, i) => i !== index))}
                      className="rounded-lg p-2 text-rose-300"
                      aria-label={`Xóa câu hỏi ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={entry.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    placeholder="Câu trả lời"
                    aria-label={`Câu trả lời ${index + 1}`}
                    className={inputClass}
                  />
                </div>
              ))}
            </fieldset>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                <span>SEO title</span>
                <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span>Ảnh OG (URL)</span>
                <input value={ogImage} onChange={(e) => setOgImage(e.target.value)} className={inputClass} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                <span>SEO description</span>
                <textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputClass} />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <input type="checkbox" checked={indexable} onChange={(e) => setIndexable(e.target.checked)} className="size-4 accent-cyan-500" />
              Hiển thị công khai trên website
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300">
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-black text-slate-950 disabled:opacity-60"
              >
                <Save className="size-4" /> {saving ? 'Đang lưu...' : 'Lưu nhu cầu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
