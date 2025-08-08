// File: src/components/FAQ.jsx
// Purpose: FAQ section using DaisyUI collapsible accordion

import React from 'react';

export default function FAQ() {
	const faqs = [
		{
			q: 'Where do you source your beans?',
			a: 'We source from ethically-run farms around the world.'
		},
		{ q: 'How fresh is the coffee?', a: 'We roast weekly and ship within 24 hours.' },
		{ q: 'Do you offer subscriptions?', a: 'Yes, customizable plans are available.' },
		{ q: 'Can I return a product?', a: 'Yes, within 30 days if unopened.' },
		{ q: 'Do you ship internationally?', a: 'Yes, to most countries with tracking.' }
	];

	return (
		<section className="bg-base-200 px-6 py-12">
			<h2 className="mb-8 text-center font-serif text-4xl">Frequently Asked Questions</h2>
			<div className="join join-vertical mx-auto w-full max-w-3xl">
				{faqs.map((faq, idx) => (
					<div className="collapse-arrow bg-base-100 join-item collapse" key={idx}>
						<input type="checkbox" />
						<div className="collapse-title text-lg font-medium">{faq.q}</div>
						<div className="collapse-content">
							<p>{faq.a}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
