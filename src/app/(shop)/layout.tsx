import React, { ReactNode } from 'react';
import Footer from '@/components/layout/storefront/Footer';
import Header from '@/components/layout/storefront/Header';
import ReactQueryProvider from '@/contexts/QueryProvider';
import AuthProvider from '@/components/auth-provider';
import LoginPopup from '@/components/shop/LoginPopup';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div>
			<AuthProvider>
				<ReactQueryProvider>
					<Header />
					<main className="min-h-screen">{children}</main>
					<LoginPopup />
					<Footer />
				</ReactQueryProvider>
			</AuthProvider>
		</div>
	);
}
