'use client';

import Link from 'next/link';
import ResponsiveNav from './ResponsiveNav';
import ThemeToggle from '@/components/common/ThemeToggle';
import { styles } from '@/styles/styleUtils';

export default function Header() {
	return (
		<header className='bg-white dark:bg-dark-bg shadow-sm border-b border-neutral-200 dark:border-dark-border'>
			<div className={styles.container('xl')}>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<div className='flex items-center'>
						<Link
							href='/'
							className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
							Home Made Delites
						</Link>
					</div>

					{/* Theme Toggle + Navigation */}
					<div className='flex items-center space-x-4'>
						{/* Theme toggle button */}
						<ThemeToggle />

						{/* Responsive Navigation */}
						<ResponsiveNav />
					</div>
				</div>
			</div>
		</header>
	);
}
