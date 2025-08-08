// File: src/components/Testimonials.jsx
// Purpose: Customer testimonials section with avatar, quote, and location

import React from 'react';

export default function Testimonials() {
	return (
		<section className="bg-base-100 px-6 py-16">
			<h2 className="mb-12 text-center font-serif text-4xl">What Our Customers Say</h2>
			<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<div className="card bg-base-200 p-6 shadow-lg" key={i}>
						<div className="flex items-center gap-4">
							<div className="avatar">
								<div className="w-16 rounded-full">
									<img src={`/images/user${i}.jpg`} alt={`User ${i}`} />
								</div>
							</div>
							<div>
								<h4 className="font-bold">Customer {i}</h4>
								<p className="text-sm text-gray-500">
									City {i}, State {i}
								</p>
							</div>
						</div>
						<p className="mt-4 italic">
							“Absolutely love the coffee quality and customer service.”
						</p>
						<div className="rating mt-2">
							<input
								type="radio"
								name={`rating-${i}`}
								className="mask mask-star-2 bg-orange-400"
								checked
								readOnly
							/>
							<input
								type="radio"
								name={`rating-${i}`}
								className="mask mask-star-2 bg-orange-400"
								checked
								readOnly
							/>
							<input
								type="radio"
								name={`rating-${i}`}
								className="mask mask-star-2 bg-orange-400"
								checked
								readOnly
							/>
							<input
								type="radio"
								name={`rating-${i}`}
								className="mask mask-star-2 bg-orange-400"
								checked
								readOnly
							/>
							<input
								type="radio"
								name={`rating-${i}`}
								className="mask mask-star-2 bg-orange-400"
								checked
								readOnly
							/>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
