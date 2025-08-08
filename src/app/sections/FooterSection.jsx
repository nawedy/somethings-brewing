// File: src/components/Footer.jsx
// Purpose: Footer with logo, links, newsletter, and copyright

import React from 'react';

export default function Footer() {
	return (
		<footer className="footer bg-neutral text-neutral-content p-10">
			<div>
				<img src="/assets/image/logo.svg" alt="Logo" className="w-16" />
				<p>
					Something’s Brewing Ltd.
					<br />
					Crafted with love & caffeine
				</p>
			</div>
			<div>
				<span className="footer-title">Quick Links</span>
				<a className="link link-hover">Shop</a>
				<a className="link link-hover">Blog</a>
				<a className="link link-hover">Brew Guide</a>
			</div>
			<div>
				<span className="footer-title">Resources</span>
				<a className="link link-hover">FAQ</a>
				<a className="link link-hover">Support</a>
				<a className="link link-hover">Terms</a>
			</div>
			<div>
				<span className="footer-title">Newsletter</span>
				<div className="form-control w-80">
					<label className="label">
						<span className="label-text text-white">Enter your email address</span>
					</label>
					<div className="relative">
						<input
							type="email"
							placeholder="username@site.com"
							className="input input-bordered w-full pr-16"
						/>
						<button className="btn btn-primary absolute top-0 right-0 rounded-l-none">
							Subscribe
						</button>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="mt-10 flex w-full justify-between border-t pt-4 text-sm">
				<span>© 2025 Something’s Brewing. All rights reserved.</span>
				<div className="flex gap-4">
					<a href="#">Twitter</a>
					<a href="#">Instagram</a>
					<a href="#">Facebook</a>
				</div>
			</div>
		</footer>
	);
}
