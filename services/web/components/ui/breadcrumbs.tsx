import Link from 'next/link';
import { Boxes, ChevronRight, Home, Layers, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  type?: 'home' | 'product' | 'environment' | 'feature';
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-muted-foreground mb-4 flex items-center text-sm">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = getIcon(item.type);

          return (
            <Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4 text-slate-300" />}
              <li className={cn('flex items-center gap-1', isLast && 'text-foreground font-semibold')}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-slate-100 hover:text-blue-600"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1">
                    {Icon && <Icon className="text-primary h-3.5 w-3.5" />}
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

function getIcon(type?: BreadcrumbItem['type']) {
  switch (type) {
    case 'home':
      return Home;
    case 'product':
      return Boxes;
    case 'environment':
      return Layers;
    case 'feature':
      return ToggleRight;
    default:
      return null;
  }
}
