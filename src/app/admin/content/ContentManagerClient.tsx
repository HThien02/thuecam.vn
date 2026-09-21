'use client';

import React, { useState } from 'react';
import { Article } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  FileText,
  Compass,
  X,
  Save,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface Props {
  initialArticles: Article[];
}

export default function ContentManagerClient({ initialArticles }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'blog' | 'guide' | 'comparison' | 'landing'>('blog');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [authorName, setAuthorName] = useState('Đội Ngũ Kỹ Thuật THUECAM');
  const [reviewerName, setReviewerName] = useState('Hoàng Long');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [pillarSlug, setPillarSlug] = useState('thue-camera-du-lich');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const filteredArticles = articles.filter((a) => {
    if (filterType !== 'ALL' && a.type !== filterType) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setType('blog');
    setExcerpt('');
    setContent('');
    setFeaturedImage('https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop');
    setAuthorName('Minh Tuấn');
    setReviewerName('Hoàng Long');
    setStatus('PUBLISHED');
    setPillarSlug('thue-camera-du-lich');
    setSeoTitle('');
    setSeoDescription('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug);
    setType(art.type);
    setExcerpt(art.excerpt);
    setContent(art.content);
    setFeaturedImage(art.featured_image);
    setAuthorName(art.author_name);
    setReviewerName(art.reviewer_name || '');
    setStatus(art.status);
    setPillarSlug(art.pillar_slug || 'thue-camera-du-lich');
    setSeoTitle(art.seo_title || art.title);
    setSeoDescription(art.seo_description || art.excerpt);
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (editingArticle) {
      // Update
      const updated: Article = {
        ...editingArticle,
        title,
        slug,
        type,
        excerpt,
        content,
        featured_image: featuredImage,
        author_name: authorName,
        reviewer_name: reviewerName,
        status,
        pillar_slug: pillarSlug,
        seo_title: seoTitle,
        seo_description: seoDescription,
        updated_at: now,
      };

      setArticles(articles.map((a) => (a.id === editingArticle.id ? updated : a)));
    } else {
      // Create new
      const newArticle: Article = {
        id: `art-${Date.now()}`,
        title,
        slug,
        type,
        excerpt,
        content,
        featured_image: featuredImage,
        author_name: authorName,
        reviewer_name: reviewerName,
        status,
        pillar_slug: pillarSlug,
        seo_title: seoTitle,
        seo_description: seoDescription,
        indexable: true,
        published_at: now,
        updated_at: now,
      };

      setArticles([newArticle, ...articles]);
    }

    setIsEditorOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Bộ lọc theo loại:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Tất cả ({articles.length})
          </button>
          <button
            onClick={() => setFilterType('blog')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'blog'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Blog Guides
          </button>
          <button
            onClick={() => setFilterType('comparison')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'comparison'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            So Sánh
          </button>
          <button
            onClick={() => setFilterType('guide')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'guide'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Hướng Dẫn
          </button>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Viết Mới</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 px-3">Tiêu đề bài viết</th>
              <th className="py-3 px-3">Định dạng</th>
              <th className="py-3 px-3">Topic Cluster</th>
              <th className="py-3 px-3">Tác giả</th>
              <th className="py-3 px-3">Trạng thái</th>
              <th className="py-3 px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredArticles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-800/30">
                <td className="py-3.5 px-3">
                  <span className="font-bold text-white block max-w-sm truncate">{art.title}</span>
                  <span className="text-[11px] text-slate-500 font-mono">/{art.slug}</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-cyan-300 uppercase">
                    {art.type}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  {art.pillar_slug ? (
                    <span className="text-cyan-400 font-mono text-[11px]">/{art.pillar_slug}</span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-slate-400">{art.author_name}</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      art.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : art.status === 'DRAFT'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {art.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                      title="Chỉnh sửa nội dung & SEO"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition-colors"
                      title="Xóa bài"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 p-6 space-y-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingArticle ? 'Chỉnh Sửa Bài Viết & Thẻ SEO' : 'Tạo Bài Viết Chuẩn SEO Mới'}
                </h3>
                <span className="text-xs text-slate-400">
                  Nội dung Markdown, hỗ trợ gắn Topic Cluster và thông tin tác giả thực
                </span>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tiêu đề bài viết: *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL Slug (không dấu, cách bằng gạch nối): *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Loại nội dung:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'blog' | 'guide' | 'comparison' | 'landing')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="blog">Blog bài viết</option>
                    <option value="guide">Hướng dẫn kỹ thuật</option>
                    <option value="comparison">So sánh thiết bị</option>
                    <option value="landing">Curated Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trạng thái:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="PUBLISHED">PUBLISHED (Xuất bản công khai)</option>
                    <option value="DRAFT">DRAFT (Bản nháp)</option>
                    <option value="ARCHIVED">ARCHIVED (Lưu trữ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic Cluster Pillar:</label>
                  <input
                    type="text"
                    value={pillarSlug}
                    onChange={(e) => setPillarSlug(e.target.value)}
                    placeholder="thue-camera-du-lich"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Đoạn trích tóm tắt (Excerpt):</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nội dung chi tiết (Markdown):</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tác giả (Author):</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Người duyệt (Reviewer):</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-cyan-400 block">Tùy Chỉnh SEO Cho Bài Viết</span>
                <div>
                  <label className="block text-slate-300 mb-1">SEO Title:</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Mặc định lấy tiêu đề bài viết"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">SEO Meta Description:</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Mặc định lấy đoạn trích tóm tắt"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Bài Viết</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
