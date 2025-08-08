'use client';

import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { allowedMenus, PermissionSet } from '@/types/permission';
import { useItems } from '@/hooks/useQueryProtected';
import { MenuType } from '@/types/common';
import { mapIcon } from '@/lib/common';

function Sidebar() {
	const { data: userPermissions, refetch } = useItems<PermissionSet[]>('permissions/user', { enabled: false });
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();
	const { isDrawerOpen, toggleDrawer } = useDrawer();
	const [activeBg, setActiveBg] = useState(theme === 'dark' ? 'bg-fuchsia-900' : 'bg-sky-600');
	const [activeSection, setActiveSection] = useState(pathname.split('/').filter(Boolean).pop() ?? '');
	const [menus, setMenus] = useState<MenuType[]>([]);
	const router = useRouter();

	const goPage = (menuId: string) => {
		setActiveSection(menuId);
		if (menuId === 'dashboard') {
			router.replace(`/dashboard`);
		} else {
			router.replace(`/dashboard/${menuId}`);
		}
	};

	const onSignOut = () => {
		localStorage.removeItem('session_expiry');
		localStorage.removeItem('user_permissions');
		signOut();
	}

	useEffect(() => {
		setActiveBg(theme === 'dark' ? 'bg-fuchsia-900' : 'bg-sky-600');
	}, [theme]);

	useEffect(() => {
		refetch();
	}, []);

	useEffect(() => {
		if (userPermissions) {
			localStorage.setItem('user_permissions', JSON.stringify(userPermissions));
			const menuList = userPermissions.filter((data) => {
				return data.action === 'access_menu' && allowedMenus.includes(data.resource)
			}).map((data) => {
				return { icon: mapIcon(data.resource), label: data.resource, id: data.resource }
			}).sort((a, b) => {
				return allowedMenus.indexOf(a.id) - allowedMenus.indexOf(b.id);
			});
			setMenus(menuList);
		} else {
			localStorage.removeItem('user_permissions');
			setMenus([]);
		}
	}, [userPermissions, allowedMenus]);

	return (
		<div
			className={`fixed ${theme === 'dark' ? 'bg-fuchsia-950' : 'bg-sky-500'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} w-64 h-screen z-20`}>
			<div className="p-4">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-md font-bold text-white">Sample E-Commerce</h2>
					<button onClick={toggleDrawer} className="lg:hidden">
						<Menu className="w-5 h-5 text-white" />
					</button>
				</div>

				<nav className="space-y-2">
					{menus?.map(({ icon: Icon, label, id }) => (
						<button
							key={label}
							className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer text-white ${activeSection === id ? activeBg : ''}`}
							onClick={() => goPage(id)}>
							<Icon size={20} />
							<span>{label}</span>
						</button>
					))}
				</nav>

				<div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
					<button
						className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer ${activeBg} text-white transition-colors`}
						onClick={toggleTheme}>
						{theme === 'light' ? (
							<>
								<Sun size={20} />
								<span>Light Mode</span>
							</>
						) : (
							<>
								<Moon size={20} />
								<span>Dark Mode</span>
							</>
						)}
					</button>
					<button
						className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer text-white"
						onClick={onSignOut}>
						<LogOut size={20} />
						<span>Logout</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
