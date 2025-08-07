import { Geist, Geist_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata = {
	title: 'Home Made Delites',
	description: 'Search for recipes to inspire your next home made delights!'
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className='antialiased' >
                <Header />
                <main className='flex-grow'>
                    {children}
                </main>
                <Footer />
			</body>
		</html>
	);
}
