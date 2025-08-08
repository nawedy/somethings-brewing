// File: src/components/BrewGuideQuiz.jsx
// Purpose: Brew quiz intro with flow and call-to-action design

import React from 'react';

export default function BrewGuideQuiz() {
	return (
		<section id="brew-guide" className="bg-base-100 p-10 text-center">
			<h2 className="mb-4 font-serif text-4xl">Brew Guide Quiz</h2>
			<button className="btn btn-primary btn-lg mb-6">Take the Quiz</button>
			<p className="text-base-content mx-auto max-w-xl">
				Find your perfect brew style in under 60 seconds.
			</p>

			{/* Quiz Flow (Placeholder for logic integration) */}
			<div className="mt-10 grid gap-4">
				<p className="font-bold">Quiz Flow:</p>
				<ol className="mx-auto max-w-2xl list-decimal text-left">
					<li>Select preferred roast level (Light, Medium, Dark)</li>
					<li>Choose your favorite flavor profile (Nutty, Fruity, Spicy, etc.)</li>
					<li>Pick a brewing method (Pour Over, Espresso, French Press, etc.)</li>
					<li>Specify your caffeine preference</li>
					<li>Get your personalized coffee match</li>
				</ol>
			</div>
		</section>
	);
}
