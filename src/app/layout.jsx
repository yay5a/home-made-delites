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

        <main id="main-content" className="container mx-auto p-4 sm:p-8 md:grid md:grid-cols-[260px_1fr] gap-8  mt-8 space-y-6 md:mt-0">
                    {children}
                    </main>
                <Footer />
			</body>
		</html>
	);
}
