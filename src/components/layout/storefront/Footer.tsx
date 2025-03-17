'use client';

const Footer = () => {
	return (
		<footer className="bg-fuchsia-200 border-t border-t-white border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-semibold text-fuchsia-950 mb-4">About Us</h3>
						<p className="text-fuchsia-900">Providing innovative solutions for your digital needs.</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold text-fuchsia-950 mb-4">Contact</h3>
						<p className="text-fuchsia-900">
							Email: info@example.com
							<br />
							Phone: (123) 456-7890
						</p>
					</div>
					<div>
						<div className="max-w-md mx-auto flex flex-col gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 rounded-lg text-fuchsia-900"
							/>
							<button className="bg-fuchsia-800 text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors">
								Subscribe
							</button>
						</div>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t border-t-white border-border text-center text-stone-700">
					© {new Date().getFullYear()} Your Company. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
