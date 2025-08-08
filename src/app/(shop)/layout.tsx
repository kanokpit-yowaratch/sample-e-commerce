import React, { ReactNode } from 'react';
import Footer from '@/components/layout/storefront/Footer';
import Header from '@/components/layout/storefront/Header';
import LoginPopup from '@/components/shop/LoginPopup';
import SyncCartOnLogin from '@/components/layout/storefront/SyncCartOnLogin';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div>
			<Header />
			<main>{children}</main>
			<SyncCartOnLogin />
			<LoginPopup />
			<Footer />
		</div>
	);
}
