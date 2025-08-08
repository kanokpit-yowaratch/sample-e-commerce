import React from 'react';
import PaymentRequestCp from '@/components/shop/upload-slip/PaymentRequest';
import Header from '@/components/layout/storefront/Header';
import LoginPopup from '@/components/shop/LoginPopup';
import Footer from '@/components/layout/storefront/Footer';

function page() {
	return (
		<div>
			<Header />
			<main className="min-h-screen">
				<div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<PaymentRequestCp />
					</div>
				</div>
			</main>
			<LoginPopup />
			<Footer />
		</div>
	);
}

export default page;
