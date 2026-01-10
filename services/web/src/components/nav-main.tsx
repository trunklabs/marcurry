'use client';

import { IconDashboard, IconFolder, IconFlag } from '@tabler/icons-react';
import Link from 'next/link';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/ui/sidebar';

const iconMap = {
  dashboard: IconDashboard,
  folder: IconFolder,
  flag: IconFlag,
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: keyof typeof iconMap;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = item.icon ? iconMap[item.icon] : null;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url}>
                    {IconComponent && <IconComponent />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
