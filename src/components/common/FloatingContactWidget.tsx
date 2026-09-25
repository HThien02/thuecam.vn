'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { usePathname } from 'next/navigation';
import { MessageSquare, Phone, X } from 'lucide-react';

interface PublicContactSettings {
  contact_manager_name: string;
  hotline: string;
  zalo: string;
  facebook_url: string;
  instagram_url: string;
  whatsapp_url: string;
}

async function fetchContactSettings(url: string): Promise<{ settings: PublicContactSettings | null }> {
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'Không thể tải thông tin liên hệ.');
  return result;
}

function safeHttpsUrl(value: string | null | undefined) {
  if (!value?.trim()) return '';
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

interface ContactChannel {
  name: string;
  label: string;
  href: string;
  bgColor: string;
  hoverGlow: string;
  icon: React.ReactNode;
}

export default function FloatingContactWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const { data: contactData } = useSWR('/api/public/contact', fetchContactSettings, { revalidateOnFocus: false });
  const settings = contactData?.settings;
  const hasLoadedSettings = contactData !== undefined;
  const managerName = settings?.contact_manager_name?.trim() || 'THUECAM';
  const phoneDigits = settings?.hotline.replace(/\\D/g, '') ?? '';
  const hotlineHref = hasLoadedSettings
    ? phoneDigits ? `tel:${phoneDigits.startsWith('84') ? `+${phoneDigits}` : phoneDigits}` : ''
    : 'tel:+84932501411';
  const zaloHref = !hasLoadedSettings
    ? 'https://zalo.me/0932501411'
    : safeHttpsUrl(settings?.zalo) || (phoneDigits ? `https://zalo.me/${phoneDigits}` : '');

  // Do not display on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const channels: ContactChannel[] = [
    {
      name: 'Hotline',
      label: settings?.hotline ? `Gọi ${managerName}: ${settings.hotline}` : 'Gọi hotline THUECAM',
      href: hotlineHref,
      bgColor: 'bg-sky-700',
      hoverGlow: 'hover:shadow-[0_0_18px_rgba(2,132,199,0.5)]',
      icon: <Phone className="size-5" aria-hidden="true" />,
    },
    {
      name: 'Zalo',
      label: settings?.zalo ? `Chat Zalo: ${settings.zalo}` : 'Chat Zalo THUECAM',
      href: zaloHref,
      bgColor: 'bg-[#0068FF]',
      hoverGlow: 'hover:shadow-[0_0_18px_rgba(0,104,255,0.6)]',
      icon: (
        <svg viewBox="0 0 48 48" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M24 4C13 4 4 12.5 4 23c0 5.4 2.4 10.3 6.3 13.8L8 44l7.6-2.5C18.3 42.4 21.1 43 24 43c11 0 20-8.5 20-19S35 4 24 4zm-7.6 24.3c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2c2.3 0 4.2 1.9 4.2 4.2s-1.9 4.2-4.2 4.2zm15.2 0c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      label: `Nhắn WhatsApp ${managerName}`,
      href: hasLoadedSettings ? safeHttpsUrl(settings?.whatsapp_url) : 'https://wa.me/84932501411',
      bgColor: 'bg-[#25D366]',
      hoverGlow: 'hover:shadow-[0_0_18px_rgba(37,211,102,0.6)]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.4 1.25-1.95 1.29-.53.04-1.22.06-3.95-1.07-3.48-1.44-5.74-4.99-5.91-5.22-.17-.23-1.42-1.89-1.42-3.61 0-1.72.9-2.57 1.22-2.92.32-.35.7-.44.93-.44.23 0 .46 0 .66.01.21.01.49-.08.77.58.28.68.96 2.34 1.05 2.51.09.17.15.38.03.61-.12.23-.18.37-.36.58-.17.21-.37.47-.53.63-.17.17-.35.36-.15.7.2.35.89 1.47 1.91 2.38 1.31 1.17 2.42 1.53 2.76 1.7.35.17.55.15.76-.09.2-.24.87-1.02 1.11-1.37.23-.35.47-.29.79-.17.32.12 2.03.96 2.38 1.13.35.17.58.26.67.41.09.15.09.87-.15 1.55z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      label: `Instagram ${managerName}`,
      href: hasLoadedSettings ? safeHttpsUrl(settings?.instagram_url) : 'https://instagram.com/thuecam.vn',
      bgColor: 'bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4]',
      hoverGlow: 'hover:shadow-[0_0_18px_rgba(225,48,108,0.6)]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Fanpage Facebook',
      label: `Fanpage Facebook ${managerName}`,
      href: hasLoadedSettings ? safeHttpsUrl(settings?.facebook_url) : 'https://facebook.com/thuecam.vn',
      bgColor: 'bg-[#1877F2]',
      hoverGlow: 'hover:shadow-[0_0_18px_rgba(24,119,242,0.6)]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2.5 print:hidden select-none"
      role="complementary"
      aria-label={`Kênh liên hệ trực tiếp ${managerName}`}
    >
      {isOpen && (
        <div className="flex flex-col gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          {channels.filter((channel) => channel.href).map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={channel.label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${channel.bgColor} ${channel.hoverGlow}`}
            >
              {channel.icon}
              {/* Tooltip on hover (desktop) */}
              <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-slate-900/95 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 border border-slate-700/60">
                {channel.label}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Thu gọn kênh liên hệ' : 'Mở kênh liên hệ Zalo, WhatsApp, Instagram, Facebook'}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20 hover:border-sky-400"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
        </span>
        {isOpen ? (
          <X className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
        ) : (
          <MessageSquare className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}
