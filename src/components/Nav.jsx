"use client";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function Nav() {
	const { isAuthenticated, logout } = useContext(AuthContext);
	const [open, setOpen] = useState(false);

	const common = [
		{ href: "/", label: "Home" },
		{ href: "/recipes", label: "Recipes" },
	];
	const guest = [
		{ href: "/login", label: "Login" },
		{ href: "/register", label: "Register" },
	];
	const authed = [{ href: "/dashboard", label: "Dashboard" }];

	return (
		<nav className="w-full border-b bg-white">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<Link href="/" className="font-bold text-amber-700">
					Home Made Delites
				</Link>
				<button
					className="md:hidden px-3 py-2 border rounded"
					onClick={() => setOpen((v) => !v)}
				>
					Menu
				</button>
				<ul className="hidden md:flex items-center gap-5">
					{[...common, ...(isAuthenticated ? authed : guest)].map((i) => (
						<li key={i.href}>
							<Link className="hover:text-amber-700" href={i.href}>
								{i.label}
							</Link>
						</li>
					))}
					{isAuthenticated && (
						<li>
							<button
								onClick={logout}
								className="text-amber-700 hover:underline"
							>
								Logout
							</button>
						</li>
					)}
				</ul>
			</div>
			{open && (
				<ul className="md:hidden border-t p-3 space-y-2">
					{[...common, ...(isAuthenticated ? authed : guest)].map((i) => (
						<li key={i.href}>
							<Link href={i.href} onClick={() => setOpen(false)}>
								{i.label}
							</Link>
						</li>
					))}
					{isAuthenticated && (
						<li>
							<button
								onClick={() => {
									logout();
									setOpen(false);
								}}
							>
								Logout
							</button>
						</li>
					)}
				</ul>
			)}
		</nav>
	);
}
