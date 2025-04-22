"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'All Redemptions', href: '/redemptions' },
    { name: 'Add New Redemption', href: '/redemptions/new' },
  ];

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-full mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-[#8B5CF6] text-white h-10 w-10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="ml-2 text-[#8B5CF6] font-bold text-xl">BirthdayPerks</span>
            </Link>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search something"
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent w-64"
              />
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-gray-600 hover:bg-purple-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <Link href="/notifications" className="text-gray-500 hover:text-gray-700 relative p-2 bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {/* Notification indicator */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </Link>
            {/* User Avatar */}
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white relative">
              <Image 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80" 
                alt="User avatar" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 