import FeaturedRecipe from "@/components/FeaturedRecipes";

export default function DashboardPage() {
	return (
		<div className="container mx-auto px-4 py-10">
			<h1 className="text-2xl font-semibold">Your Dashboard</h1>
			<p className="text-gray-600 mt-2">
				Suggested recipes (based on your preferences) and your favorites will
				appear here.
			</p>
			<FeaturedRecipe />
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				<section>
					<h2 className="font-semibold mb-3">Suggested for you</h2>
					<div className="text-sm text-gray-500">Coming soon</div>
				</section>
				<section>
					<h2 className="font-semibold mb-3">Your favorites</h2>
					<div className="text-sm text-gray-500">Coming soon</div>
				</section>
			</div>
		</div>
	);
}
