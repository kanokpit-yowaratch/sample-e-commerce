import React, { ReactNode } from 'react';
import Footer from '@/components/layout/storefront/Footer';
import Header from '@/components/layout/storefront/Header';
import ReactQueryProvider from '@/contexts/QueryProvider';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div>
			<ReactQueryProvider>
				<Header />
				<main className="min-h-screen">{children}</main>
				<Footer />
			</ReactQueryProvider>
		</div>
	);
}
