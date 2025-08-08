// File: src/components/Header.jsx
// Purpose: NeoMorphic top navigation bar with logo left, centered nav, and CTA buttons on the right

import React from 'react';

export default function Header() {
	return (
		<header className="m-4 flex items-center justify-between gap-6 rounded-lg border border-white/10 bg-white/20 px-6 py-3 shadow-inner backdrop-blur-md">
			{/* Left: Circular Logo */}
			<div className="flex items-center">
				<img src="/assets/image/logo.svg" alt="Logo" className="h-12 w-12 rounded-full shadow-md" />
			</div>

			{/* Center: Navigation Menu */}
			<nav className="text-secondary-content hidden gap-6 text-base font-medium md:flex">
				<a href="#coffee" className="hover:text-accent">
					Coffee
				</a>
				<a href="#accessories" className="hover:text-accent">
					Accessories
				</a>
				<a href="#merch" className="hover:text-accent">
					Merch
				</a>
				<a href="#blog" className="hover:text-accent">
					Blog
				</a>
				<a href="#brew-guide" className="hover:text-accent">
					Brew Guide
				</a>
			</nav>

			{/* Right: CTA Buttons */}
			<div className="flex gap-2">
				<button className="btn btn-outline btn-sm rounded-full">Register</button>
				<button className="btn btn-primary btn-sm rounded-full text-white">Login</button>
			</div>
		</header>
	);
}
