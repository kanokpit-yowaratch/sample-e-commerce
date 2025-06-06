'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useModal } from '@/stores/zustand/modalStore';
import useCartStore from '@/stores/zustand/useCartStore';
import { useLoginStore } from '@/stores/zustand/loginStore';
import Link from 'next/link';
import NextImage from 'next/image';
import { Search, ShoppingCart, Menu, X, Bell } from 'lucide-react';

const Header = () => {
	const { data: session } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { items } = useCartStore();
	const { open } = useModal();
	const { openPopup } = useLoginStore();

	return (
		<header className="bg-fuchsia-950 text-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="hidden md:block flex-1 max-w-2xl">ติดตามเราบน | Facebook | Youtube | Line</div>

					<div className="hidden md:flex items-center space-x-6">
						<div>
							<Bell size={20} className="text-white" />
						</div>
						<div>
							{session ? (
								<button className="flex items-center rounded-full cursor-pointer" onClick={() => open()}>
									<NextImage
										src={session.user.image ?? `/images/user.png`}
										width={40}
										height={40}
										priority={true}
										alt="User avatar"
										className="w-8 h-8 rounded-full"
									/>
								</button>
							) : (
								<button
									onClick={openPopup}
									className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-800 transition-colors cursor-pointer">
									Sign In
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<NextImage
								src="/images/logo.png"
								alt="Logo"
								className="h-8 w-auto"
								width={100}
								height={50}
								priority={true}
							/>
						</Link>
					</div>

					<div className="hidden md:block flex-1 max-w-2xl mx-8">
						<div className="relative">
							<input
								type="text"
								placeholder="Search products..."
								className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<Search className="absolute right-3 top-2.5 text-gray-400" />
						</div>
					</div>

					<div className="hidden md:flex items-center space-x-6">
						<Link href={'/cart'} className="relative transition-colors">
							{items.length > 0 && (
								<div className="absolute -top-2 -right-4 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
									{items.length}
								</div>
							)}
							<ShoppingCart className="h-6 w-6" />
						</Link>
					</div>

					<button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
						{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
