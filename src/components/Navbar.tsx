"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'All Perks', href: '/perks' },
    { name: 'Add New Perk', href: '/perks/new' },
    { name: 'Notifications', href: '/notifications' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-cyan-600 font-bold text-xl">Birthday Perks Tracker</span>
            </div>
            <div className="hidden lg:block sm:ml-6">
              <div className="flex space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                } block px-3 py-2 rounded-md text-base font-medium`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 