import React, { ReactNode } from 'react';
import Footer from '@/components/layout/storefront/Footer';
import Header from '@/components/layout/storefront/Header';
import ReactQueryProvider from '@/contexts/QueryProvider';
import AuthProvider from '@/components/auth-provider';
import LoginPopup from '@/components/shop/LoginPopup';
import ProfileDrawer from '@/components/layout/storefront/ProfileDrawer';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div>
			<AuthProvider>
				<ReactQueryProvider>
					<Header />
					<main className="min-h-screen">{children}</main>
					<LoginPopup />
					<div className="md:w-60 lg:w-60 xl:w-60 2xl:w-60 xs:w-20">
						<ProfileDrawer />
					</div>
					<Footer />
				</ReactQueryProvider>
			</AuthProvider>
		</div>
	);
}
