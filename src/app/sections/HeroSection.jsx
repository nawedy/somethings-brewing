// File: src/components/Hero.jsx
// Purpose: Hero section with background video and CTA content on the left

import React from 'react';

export default function Hero() {
	return (
		<section className="relative flex min-h-screen items-center">
			{/* Background Video */}
			<video
				autoPlay
				muted
				loop
				playsInline
				className="absolute z-0 h-full w-full object-cover"
				src="/assets/video/hero-background.mp4"
			/>

			{/* Overlay */}
			<div className="bg-opacity-40 absolute z-10 h-full w-full bg-black" />

			{/* Content */}
			<div className="relative z-20 max-w-2xl p-10 text-white">
				<h1 className="mb-4 font-serif text-6xl">Something's Brewing</h1>
				<p className="mb-6 text-xl">
					Discover bold flavors and authentic roasts from across the globe.
				</p>
				<button className="btn btn-accent btn-lg rounded-full">Shop Now</button>
			</div>
		</section>
	);
}
