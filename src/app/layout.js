import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'Home Made Delites',
	description: 'Discover and share delicious homemade recipes',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<div className='min-h-screen flex flex-col'>
						<Header />
						<main className='flex-1'>{children}</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	);
}
