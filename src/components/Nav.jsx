'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// TODO import { useContext } from 'react';
// TODO import { AuthContext } from '@/context/AuthContext';

const navItems = [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
];

export default function Nav() {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <nav className="relative top-0 w-full z-50">
            {/* Desktop Nav */}

            <ul className="hidden md:flex space-x-8">
                {navItems.map(({ href, label }) => (
                    <li key={href}>
                        <Link href={href} className="text-amber-800 hover:text-amber-600">
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
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

            {/* Mobile Nav */}
            {openMenu && (
                <ul
                    id="mobile-menu"
                    className="md:hidden mt-2 space-y-2 p-4 shadow-lg"
                >
                    {navItems.map(({ href, label }) => (
                    <li key={href}>
                        <Link
                                href={href}
                                className="block text-amber-800 hover:text-amber-600"
                                onClick={() => setOpen(false)}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}

