// File: src/components/ProductShowcase.jsx
// Purpose: Carousel of featured products using DaisyUI card & carousel components

import React from 'react';

export default function FeaturedProducts() {
	return (
		<section className="bg-base-200 px-6 py-16">
			<h2 className="mb-10 text-center font-serif text-4xl">Featured Products</h2>
			<div className="carousel w-full">
				{[1, 2, 3].map((i) => (
					<div className="carousel-item w-full justify-center px-4" key={i}>
						<div className="card bg-base-100 w-80 shadow-xl">
							<figure>
								<img src={`/images/bag${i}.png`} alt={`Product ${i}`} />
							</figure>
							<div className="card-body">
								<h3 className="card-title">Coffee Name {i}</h3>
								<p>Explore rich flavors with this artisan roast.</p>
								<div className="card-actions justify-end">
									<button className="btn btn-sm btn-primary">Buy Now</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
