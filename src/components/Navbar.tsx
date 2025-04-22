"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'All Perks', href: '/perks' },
    { name: 'Add New Perk', href: '/perks/new' },
    { name: 'Tasks', href: '/tasks' },
  ];

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-full mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-indigo-600 font-bold text-2xl">BirthdayPerks</span>
            </Link>
          </div>
          
          <nav className="ml-10 flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                  {item.name === 'Tasks' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="ml-auto flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              V
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 