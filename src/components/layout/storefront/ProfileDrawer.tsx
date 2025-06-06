'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useModal } from '@/stores/zustand/modalStore';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { X } from 'lucide-react';
// import CountdownSessionTimer from '@/components/layout/storefront/CountdownSessionTimer';
import Link from 'next/link';

const ProfileDrawer = () => {
	const { data: session } = useSession();
	const { isOpen, close } = useModal();
	const drawerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (drawerRef.current && !(event.target instanceof Node && drawerRef.current.contains(event.target))) {
				close();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			close();
		}
	};

	const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
		(event.target as HTMLImageElement).src = '/logo.png';
	};

	const onSignOut = () => {
		localStorage.removeItem('session_expiry');
		signOut();
	}

	return (
		<div>
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
						/>
						<motion.div
							ref={drawerRef}
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 20 }}
							className="fixed bg-fuchsia-100 right-0 top-0 h-full w-full sm:w-80 bg-card dark:bg-dark-card shadow-lg z-50"
							role="dialog"
							aria-modal="true"
							onKeyDown={handleKeyDown}>
							<div className="flex flex-col h-full p-6">
								<div className="flex justify-between items-center">
									<button
										onClick={close}
										className="fixed right-3 top-3 p-2 hover:bg-gray-300 rounded-full transition-all cursor-pointer"
										aria-label="Close menu">
										<X className="w-5 h-5 text-fuchsia-700" />
									</button>
								</div>
								<div className="flex flex-col items-center mb-4">
									<div className="flex flex-col items-center justify-center gap-1">
										{session && (
											<>
												<NextImage
													src={session.user.image ?? `/images/user.png`}
													width={40}
													height={40}
													priority={true}
													alt={session.user.name ?? 'Profile'}
													className="w-8 h-8 rounded-full"
													onError={handleImageError}
												/>
												<span className="text-blue-900 font-semibold">{session.user.name}</span>
											</>
										)}
										{/* <CountdownSessionTimer /> */}
										<Link href={'/order-history'} className="p-2 text-sky-700 cursor-pointer rounded-md">
											Order History
										</Link>
										<button
											className="px-2 py-1 rounded-md bg-fuchsia-700 text-white cursor-pointer hover:bg-fuchsia-800 transition-all"
											onClick={onSignOut}>
											Sign out
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProfileDrawer;
