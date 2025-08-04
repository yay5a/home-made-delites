import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Nav from './Nav';
import { AuthProvider } from '@/context/AuthContext';

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
				<AuthProvider>
					<div className='flex flex-col min-h-screen'>
						<Nav />
						<main className='flex-1'>{children}</main>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
