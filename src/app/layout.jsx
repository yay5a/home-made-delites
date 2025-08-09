import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
	title: "Home Made Delites",
	description: "Search for recipes to inspire your next home made delights!",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="antialiased">
				<div className="w-full bg-gradient-to-r from-amber-400 via-rose-300 to-amber-400 text-white text-center py-2 font-semibold shadow-md">
					🚀 More features coming soon, including premium options! Stay tuned
					for updates.
				</div>
				<AuthProvider>
					<Header />
					<main
						id="main-content"
						className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16"
					>
						{children}
						<Analytics />
					</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
