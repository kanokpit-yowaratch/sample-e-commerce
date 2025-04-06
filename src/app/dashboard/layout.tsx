import React, { ReactNode } from 'react';
import AdminHeader from '@/components/layout/dashboard/AdminHeader';
import Sidebar from '@/components/layout/dashboard/Sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import ReactQueryProvider from '@/contexts/QueryProvider';

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<ReactQueryProvider>
			<ThemeProvider>
				<DrawerProvider>
					<div className="flex h-screen bg-white">
						<Sidebar />
						<div className="flex-1 overflow-auto">
							<AdminHeader />
							<main className="p-6">{children}</main>
						</div>
					</div>
				</DrawerProvider>
			</ThemeProvider>
		</ReactQueryProvider>
	);
}
