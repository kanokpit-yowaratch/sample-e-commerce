import React, { ReactNode } from 'react';
import Footer from '@/components/layout/storefront/Footer';
import Header from '@/components/layout/storefront/Header';
import LoginPopup from '@/components/shop/LoginPopup';
import ProfileDrawer from '@/components/layout/storefront/ProfileDrawer';
import SyncCartOnLogin from '@/components/layout/storefront/SyncCartOnLogin';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div>
			<Header />
			<main className="min-h-screen">{children}</main>
			<SyncCartOnLogin />
			<LoginPopup />
			<div className="md:w-60 lg:w-60 xl:w-60 2xl:w-60 xs:w-20">
				<ProfileDrawer />
			</div>
			<Footer />
		</div>
	);
}
