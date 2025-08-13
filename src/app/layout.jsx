import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
	),
	title: "Home Made Delites — Discover Your Next Homemade Recipe",
	description:
		"Search cozy, home-style recipes. Save favorites and get smart suggestions on your dashboard.",
	openGraph: {
		title: "Home Made Delites",
		description:
			"Search cozy, home-style recipes. Save favorites and get smart suggestions.",
		url: "/",
		siteName: "Home Made Delites",
		images: [
			{
				url: "/og-default.jpg",
				width: 1200,
				height: 630,
				alt: "Home Made Delites",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Home Made Delites",
		description: "Search cozy, home-style recipes.",
		images: ["/og-default.jpg"],
	},
	robots: { index: true, follow: true },
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
						<SpeedInsights />
						<Analytics />
					</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
