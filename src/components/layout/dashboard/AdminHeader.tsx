'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import NextImage from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { useDrawer } from '@/contexts/DrawerContext';

function AdminHeader() {
	const { theme } = useTheme();
	const { toggleDrawer } = useDrawer();

	return (
		<header className={`${theme === 'dark' ? 'bg-fuchsia-950' : 'bg-sky-500'} sticky top-0 z-10`}>
			<div className="flex items-center justify-between p-4">
				<button onClick={toggleDrawer} className="lg:hidden text-foreground">
					<Menu size={24} className="text-white" />
				</button>

				<div className="flex items-center space-x-4 ml-auto">
					<button className="relative p-2 rounded-lg hover:bg-rose-800 hover:text-white text-white">
						<Bell size={20} className="text-white" />
						<span className="absolute top-1 right-1 w-2 h-2 bg-rose-900 rounded-full flex items-center justify-center text-white"></span>
					</button>

					<NextImage
						src="/images/user.png"
						width={40}
						height={40}
						alt="user"
						className="rounded-full"
						priority={true}
					/>
				</div>
			</div>
		</header>
	);
}

export default AdminHeader;
