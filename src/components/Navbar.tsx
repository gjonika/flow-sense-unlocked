
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-flowsense-600 flex items-center">
              <span className="bg-gradient-to-r from-flowsense-600 to-utility-600 bg-clip-text text-transparent">
                FlowSense
              </span>
              <span className="ml-1 text-gray-700 text-xl">Utility Guide</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-flowsense-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-flowsense-600 hover:bg-flowsense-700">Contact Us</Button>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-6 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-700 hover:text-flowsense-600 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button className="bg-flowsense-600 hover:bg-flowsense-700 w-full mt-4">Contact Us</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
