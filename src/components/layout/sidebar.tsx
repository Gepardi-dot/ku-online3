'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  Home,
  LayoutGrid,
  Heart,
  MessageSquare,
  User,
  Settings,
  Star,
  PackagePlus,
  Truck,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Electronics', icon: Home },
  { name: 'Home & Garden', icon: Home },
  { name: 'Fashion', icon: Home },
  { name: 'Health & Beauty', icon: Home },
  { name: 'Sports & Outdoors', icon: Home },
  { name: 'Toys & Games', icon: Home },
  { name: 'Books & Media', icon: Home },
  { name: 'Other', icon: Home },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
          <Icons.logo className="h-6 w-6" />
          <span className="text-lg">KurdMall</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/')}>
              <Link href="/">
                <Home />
                Marketplace
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/messages')}>
              <Link href="/messages">
                <MessageSquare />
                Messages
                <Badge variant="secondary" className="ml-auto">3</Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/favorites')}>
              <Link href="#">
                <Heart />
                Favorites
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild size="sm">
                    <Link href="#">
                      {category.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="sm:hidden mb-2">
          <Button size="sm" asChild className="w-full">
            <Link href="/create-listing">
              <PackagePlus className="mr-2 h-4 w-4" />
              Create Listing
            </Link>
          </Button>
        </div>
        <Separator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/profile')}>
              <Link href="#">
                <User />
                My Account
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/settings')}>
              <Link href="#">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
