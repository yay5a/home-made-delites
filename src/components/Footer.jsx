'use client'

import { SiFacebook } from 'react-icons/si';
import { SiInstagram } from 'react-icons/si';
import { SiX } from 'react-icons/si';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-10 pb-6">
            <div className="container mx-auto grid gap-8 md:grid-cols-12">
                {/* Brand + Social */}
                <div className="md:col-span-4 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Home Made Delites</h3>
                    <p>
                        Discover and share delicious homemade recipes with our community of food
                        lovers.
                    </p>
                    <div className="flex space-x-4">
                        <SocialIcon href="https://facebook.com" label="Facebook">
                            <SiFacebook className="w-6 h-6" />
                        </SocialIcon>
                        <SocialIcon href="https://instagram.com" label="Instagram">
                            <SiInstagram className="w-6 h-6" />
                        </SocialIcon>
                        <SocialIcon href="https://x.com" label="X / Twitter">
                            <SiX className="w-6 h-6" />
                        </SocialIcon>
                    </div>
                </div>

                {/* Support links */}
                <div className="md:col-span-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                        Support
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { href: '#', text: 'Help Center' },
                            { href: '#', text: 'Contact Us' },
                            { href: '#', text: 'Privacy Policy' },
                            { href: '#', text: 'Terms of Service' },
                        ].map(({ href, text }) => (
                                <li key={text}>
                                    <FooterLink href={href}>{text}</FooterLink>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Legal copy pushed right on desktop */}
                <div className="md:col-span-5 flex items-end md:justify-end">
                    <p className="text-sm" aria-label="Copyright">
                        &copy; {new Date().getFullYear()} Home Made Delites Developed by Yaysa. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link href={href} className="hover:text-white transition-colors">
            {children}
        </Link>
    );
}

function SocialIcon({ href, label, children }) {
    return (
        <Link href={href} aria-label={label} className="hover:text-white transition-colors">
            {children}
        </Link>
    );
}

