"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import {
	MagnifyingGlassIcon,
	HeartIcon,
	BookmarkSquareIcon,
	DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { Great_Vibes } from "next/font/google";

import SearchModal from "@/components/SearchModal";
import FeaturedRecipes from "@/components/FeaturedRecipes";
import { AuthContext } from "@/context/AuthContext";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function Home() {
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const { isAuthenticated } = useContext(AuthContext);

	return (
		<>
			{/* HERO */}
			<section className="relative py-20 container mx-auto text-center overflow-hidden">
				{/* keep your background/decoration if present */}
				<h1
					className={`${greatVibes.className} text-4xl md:text-5xl sunlight-glow relative z-10`}
				>
					Bring the warmth of home made delights to your table.
				</h1>
				<p className="mt-4 text-lg relative z-10">
					Discover, create, and share delicious homemade recipes with our
					community of passionate home cooks.
				</p>
				<div className="mt-8 flex gap-3 justify-center">
					<Link
						href="/recipes"
						className="px-5 py-3 rounded-xl bg-amber-600 text-white hover:bg-amber-500"
					>
						Browse Recipes
					</Link>
					<Link
						href="/register"
						className="px-5 py-3 rounded-xl border border-amber-600 text-amber-700 hover:bg-amber-50"
					>
						Join Free
					</Link>
				</div>
			</section>

			{/* QUICK PICKS */}
			<section className="container mx-auto px-4 pb-10">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Try something new</h2>
					<button
						className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50"
						onClick={() => setModalOpen(true)}
					>
						Shuffle ideas
					</button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Re-use your existing FeaturedRecipes 4x to keep changes minimal */}
					{[0, 1, 2, 3].map((i) => (
						<FeaturedRecipes key={i} />
					))}
				</div>
			</section>

			{/* SEARCH */}
			<section className="py-8">
				{isAuthenticated ? (
					<>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={() => setShowSearchBar((v) => !v)}
								className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors group"
							>
								<MagnifyingGlassIcon className="h-5 w-5 mr-2 group-hover:animate-[wiggle_0.3s_ease-in-out]" />
								Search
							</button>
						</div>
						{showSearchBar && (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									setModalOpen(true);
								}}
								className="mt-4 flex gap-2 justify-center"
							>
								<input
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search recipes..."
									className="px-4 py-2 border rounded-lg w-full max-w-md shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
								/>
								<button
									type="submit"
									className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500"
								>
									Go
								</button>
							</form>
						)}
						<SearchModal
							open={modalOpen}
							onClose={() => setModalOpen(false)}
							query={searchQuery}
						/>
					</>
				) : (
					<div className="text-center">
						<p className="text-gray-600">
							Sign up to unlock faster search and save your favorites.
						</p>
						<div className="mt-4">
							<Link
								href="/register"
								className="px-5 py-3 rounded-xl bg-amber-600 text-white hover:bg-amber-500"
							>
								Join Free
							</Link>
						</div>
					</div>
				)}
			</section>

			{/* HOW IT WORKS */}
			<section className="container mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold text-center mb-8">
					How it works
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
						<div className="rounded-full bg-rose-100 p-4">
							<HeartIcon className="h-6 w-6 text-rose-600" />
						</div>
						<p className="text-center">
							Discover homely recipes our community loves.
						</p>
					</div>
					<div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
						<div className="rounded-full bg-amber-100 p-4">
							<BookmarkSquareIcon className="h-6 w-6 text-amber-600" />
						</div>
						<p className="text-center">
							Save your favorites to your dashboard.
						</p>
					</div>
					<div className="p-8 rounded-2xl flex flex-col items-center space-y-4 shadow">
						<div className="rounded-full bg-yellow-100 p-4">
							<DevicePhoneMobileIcon className="h-6 w-6 text-yellow-600" />
						</div>
						<p className="text-center">
							Enjoy a clean, responsive experience anywhere.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}
