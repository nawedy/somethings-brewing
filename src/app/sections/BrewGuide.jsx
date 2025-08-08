// File: src/components/BrewGuideQuiz.jsx
// Purpose: Interactive quiz CTA section using icon blocks and quiz button

import React from 'react';

export default function BrewGuideQuiz() {
	return (
		<section className="bg-base-200 text-base-content p-10">
			<div className="text-center">
				<h2 className="mb-4 font-serif text-4xl">Brew Guide Quiz</h2>
				<p className="mb-6">Find your perfect brew style in under 60 seconds.</p>
				<button className="btn btn-primary btn-lg rounded-full">Start Quiz</button>
			</div>

			<div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
				{/* Icon Step 1 */}
				<div className="flex flex-col items-center">
					<div className="bg-accent flex h-24 w-24 items-center justify-center rounded-full text-2xl text-white">
						1
					</div>
					<p className="mt-4">Answer a few questions</p>
				</div>

				{/* Icon Step 2 */}
				<div className="flex flex-col items-center">
					<div className="bg-accent flex h-24 w-24 items-center justify-center rounded-full text-2xl text-white">
						2
					</div>
					<p className="mt-4">Discover your brew profile</p>
				</div>

				{/* Icon Step 3 */}
				<div className="flex flex-col items-center">
					<div className="bg-accent flex h-24 w-24 items-center justify-center rounded-full text-2xl text-white">
						3
					</div>
					<p className="mt-4">Get recommended beans</p>
				</div>
			</div>
		</section>
	);
}
