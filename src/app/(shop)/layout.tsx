import Footer from '@/components/layout/storefront/Footer';
import Header from '@/components/layout/storefront/Header';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header />
			<main className="min-h-screen">{children}</main>
			<Footer />
		</div>
	);
}
