import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { JsonLdScript, generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Ensure "Trang chủ" is at the start if not provided
  const fullItems: BreadcrumbItem[] =
    items.length > 0 && items[0].url === '/'
      ? items
      : [{ name: 'Trang chủ', url: '/' }, ...items];

  const jsonLdData = generateBreadcrumbJsonLd(fullItems);

  return (
    <>
      <JsonLdScript data={jsonLdData} />
      <nav aria-label="Breadcrumb" className="py-3 text-xs text-slate-500 font-medium">
        <ol className="flex flex-wrap items-center gap-1.5">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;

            return (
              <li key={item.url} className="flex items-center gap-1.5">
                {index === 0 ? (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 hover:text-[#0284c7] transition-colors"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.name}</span>
                  </Link>
                ) : isLast ? (
                  <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-[350px]">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#0284c7] transition-colors truncate max-w-[150px] sm:max-w-[250px]"
                  >
                    {item.name}
                  </Link>
                )}

                {!isLast && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
