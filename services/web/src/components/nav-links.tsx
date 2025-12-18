'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/ui/button';
import { Boxes, ToggleRight } from 'lucide-react';

const navItems = [
  { href: '/app', label: 'Feature Flags', icon: ToggleRight },
  { href: '/app/products', label: 'Projects', icon: Boxes },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === '/app' && pathname === '/app');
        return (
          <Link key={item.href} href={item.href}>
            <Button variant={isActive ? 'secondary' : 'ghost'} size="sm" className="m-1 gap-2">
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
