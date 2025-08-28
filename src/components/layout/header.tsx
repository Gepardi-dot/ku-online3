import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Heart, Bell, Menu } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AppSidebar from './sidebar';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <AppSidebar />
                </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center">
              <Icons.logo className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold text-primary">KurdMall</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands, and categories..."
                className="w-full rounded-full border-gray-300 pr-28 focus:border-primary focus:ring-primary focus:ring-2"
              />
              <Button className="absolute right-0 top-0 h-full rounded-r-full px-5 bg-primary hover:bg-accent-foreground">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login" className="flex items-center text-gray-600 hover:text-primary">
              <User className="h-6 w-6" />
              <span className="text-sm ml-1">Account</span>
            </Link>
            <Link href="#" className="flex items-center text-gray-600 hover:text-primary">
              <Heart className="h-6 w-6" />
              <span className="text-sm ml-1">Wishlist</span>
            </Link>
            <Link href="#" className="text-gray-600 hover:text-primary relative flex items-center">
                <Bell className="h-6 w-6" />
                <span className="text-sm ml-1">Notifications</span>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-2 pb-3 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search on KurdMall..."
              className="w-full rounded-full border-gray-300 pr-10 focus:border-primary"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
       {/* Categories Navigation */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6 overflow-x-auto py-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Electronics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Fashion</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Home & Garden</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Toys & Hobbies</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Beauty & Health</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Sports & Outdoors</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Automotive</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary whitespace-nowrap">Tools & Home Improvement</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}