// File: src/components/ProductShowcase.jsx
// Purpose: Showcase section featuring premium coffee bags and loyalty/reward buttons

import React from 'react';

export default function ProductShowcase() {
	return (
		<section className="bg-base-300 text-base-content px-10 py-16">
			<h2 className="mb-12 text-center font-serif text-4xl">Our Signature Roasts</h2>

			<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
				{/* Product Card 1 */}
				<div className="card bg-base-100 shadow-xl">
					<figure>
						<img src="/images/bag1.png" alt="Bag 1" />
					</figure>
					<div className="card-body text-center">
						<h3 className="card-title justify-center">Golden Roast</h3>
						<p>Perfectly balanced. Caramel, chocolate, and nutty notes.</p>
					</div>
				</div>

				{/* Product Card 2 */}
				<div className="card bg-base-100 shadow-xl">
					<figure>
						<img src="/images/bag2.png" alt="Bag 2" />
					</figure>
					<div className="card-body text-center">
						<h3 className="card-title justify-center">Bold Espresso</h3>
						<p>Rich intensity and crema. Best for espresso lovers.</p>
					</div>
				</div>

				{/* Product Card 3 */}
				<div className="card bg-base-100 shadow-xl">
					<figure>
						<img src="/images/bag3.png" alt="Bag 3" />
					</figure>
					<div className="card-body text-center">
						<h3 className="card-title justify-center">Loyalty Reserve</h3>
						<p>Exclusive blends for members. Small batch roasted.</p>
					</div>
				</div>
			</div>
		</section>
	);
}
