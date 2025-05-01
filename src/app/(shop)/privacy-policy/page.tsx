import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-12 bg-slate-50">
			<div className="bg-white p-8 rounded-lg shadow">
				<h1 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
				<p className="text-sm text-slate-500 mb-6">Last Updated: May 1, 2025</p>

				<p className="text-slate-700 mb-8">
					This Privacy Policy describes how we collect, use, and share your personal information when you use
					our application that utilizes Facebook authentication and Stripe payment processing.
				</p>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Information We Collect</h2>

				<h3 className="text-xl font-semibold text-slate-700 mb-3">Information you provide to us:</h3>
				<ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
					<li>Account information when you sign in with Facebook (name, email address, profile picture)</li>
					<li>Payment information processed through Stripe (credit card details, billing address)</li>
					<li>Transaction history and purchase information</li>
					<li>Any other information you choose to provide</li>
				</ul>

				<h3 className="text-xl font-semibold text-slate-700 mb-3">Information collected automatically:</h3>
				<ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700">
					<li>Device information (device type, operating system, browser type)</li>
					<li>Usage data (how you interact with our application)</li>
					<li>IP address and location information</li>
					<li>Cookies and similar technologies</li>
				</ul>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Your Information</h2>
				<p className="text-slate-700 mb-2">We use your information to:</p>
				<ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700">
					<li>Authenticate you via Facebook and maintain your account</li>
					<li>Process payments through Stripe</li>
					<li>Provide, maintain, and improve our services</li>
					<li>Communicate with you about your account or transactions</li>
					<li>Send you technical notices and security alerts</li>
					<li>Comply with legal obligations</li>
				</ul>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">How We Share Your Information</h2>
				<p className="text-slate-700 mb-4">We may share your information with:</p>

				<h3 className="text-xl font-semibold text-slate-700 mb-3">Service Providers:</h3>
				<ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
					<li>Facebook: For authentication purposes</li>
					<li>Stripe: For payment processing</li>
					<li>Cloud hosting and database providers</li>
				</ul>

				<h3 className="text-xl font-semibold text-slate-700 mb-3">Legal Requirements:</h3>
				<p className="text-slate-700 mb-8">
					We may disclose your information if required to do so by law or in response to valid requests by
					public authorities.
				</p>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Data Security</h2>
				<p className="text-slate-700 mb-8">
					We implement appropriate technical and organizational measures to protect your personal information
					from unauthorized access, loss, or disclosure.
				</p>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Your Rights</h2>
				<p className="text-slate-700 mb-2">Depending on your location, you may have rights to:</p>
				<ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700">
					<li>Access your personal information</li>
					<li>Correct inaccurate information</li>
					<li>Delete your information</li>
					<li>Object to or restrict certain processing</li>
					<li>Data portability</li>
				</ul>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Facebook Authentication Data</h2>
				<p className="text-slate-700 mb-8">
					When you use Facebook to sign in, we receive information in accordance with Facebook's privacy
					policy. We only access the data necessary for authentication purposes. You can manage Facebook
					permissions through your Facebook account settings.
				</p>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Stripe Payment Processing</h2>
				<p className="text-slate-700 mb-8">
					We use Stripe for payment processing. When you make a payment, your payment card information is
					securely transmitted directly to Stripe. We do not store your full credit card details on our
					servers. Stripe may use your information as described in their privacy policy:
					<Link
						href="https://sample-e-commerce.vercel.app/privacy-policy"
						className="text-blue-600 hover:text-blue-800 underline">
						https://sample-e-commerce.vercel.app/privacy-policy
					</Link>
				</p>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Changes to This Policy</h2>
				<p className="text-slate-700 mb-8">
					We may update this Privacy Policy from time to time. We will notify you of any changes by posting
					the new Privacy Policy on this page and updating the "Last Updated" date.
				</p>

				<h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
				<div className="text-slate-700 mb-8">
					If you have questions about this Privacy Policy or your personal information, please contact us at:
					<div className="font-medium">kanokpit.y@gmail.com</div>
				</div>
			</div>
		</div>
	);
}
