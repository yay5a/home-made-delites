'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// TODO import { useContext } from 'react';
// TODO import { AuthContext } from '@/context/AuthContext';


export default function Nav() {
  const [openMenu, setOpenMenu] = useState(false);
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-black/[.08] dark:border-white/[.145]">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-foreground/70 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-foreground/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {openMenu ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {openMenu && (
          <div className="md:hidden py-4 border-t border-black/[.08] dark:border-white/[.145]">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-foreground/70 transition-colors font-medium py-2"
                  onClick={() => setOpenMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

