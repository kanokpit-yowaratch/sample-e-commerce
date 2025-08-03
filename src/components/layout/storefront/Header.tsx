'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import useCartStore from '@/stores/zustand/useCartStore';
import { useLoginStore } from '@/stores/zustand/loginStore';
import Link from 'next/link';
import NextImage from 'next/image';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';

const Header = () => {
	const { data: session } = useSession();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const { items } = useCartStore();
	const { openPopup } = useLoginStore();

	const onSignOut = () => {
		localStorage.removeItem('session_expiry');
		signOut();
	};

	return (
		<header className="bg-fuchsia-950 text-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-20">
					<div className="hidden md:flex items-center space-x-1 flex-1 max-w-2xl">
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
						<Link href={'https://www.facebook.com/konbakhiancode'}>
							<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="36" viewBox="0 0 48 48">
								<path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
							</svg>
						</Link>
						<Link href={'https://www.youtube.com/@NextJSWorkshop/videos'}>
							<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" viewBox="0 0 48 48">
								<path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
							</svg>
						</Link>
					</div>

					<div className="hidden md:flex items-center space-x-6">
						<div>
							<Link href={'/cart'} className="relative transition-colors">
								{items.length > 0 && (
									<div className="absolute -top-2 -right-4 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
										{items.length}
									</div>
								)}
								<ShoppingCart className="h-6 w-6" />
							</Link>
						</div>
						<div>
							{session ? (
								<>
									<button
										type="button"
										className="flex items-center rounded-full cursor-pointer"
										onClick={() => setShowUserMenu(!showUserMenu)}
									>
										<NextImage
											src={session.user.image ?? `/images/user.png`}
											width={40}
											height={40}
											priority={true}
											alt="User avatar"
											className="w-8 h-8 rounded-full"
										/>
									</button>
									{showUserMenu && (
										<div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50">
											<div className="px-4 py-3 border-b">
												<div className="flex items-center space-x-3">
													<div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center text-white text-xl">
														<NextImage
															src={session.user.image ?? `/images/user.png`}
															width={40}
															height={40}
															priority={true}
															alt="User avatar"
															className="w-8 h-8 rounded-full"
														/>
													</div>
													<div>
														<p className="font-semibold text-gray-800">{session.user.name}</p>
														<p className="text-sm text-gray-500">{session.user.email}</p>
													</div>
												</div>
											</div>

											<div className="py-2">
												{/* <div className="px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
													<Heart className="w-4 h-4 text-gray-500" />
													<span className="text-sm text-gray-700">รายการโปรด</span>
												</div> */}
												{/* <div className="px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
													<Settings className="w-4 h-4 text-gray-500" />
													<span className="text-sm text-gray-700">ตั้งค่า</span>
												</div> */}
											</div>

											<div className="border-t pt-2">
												<button
													type="button"
													onClick={onSignOut}
													className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 text-red-600 cursor-pointer">
													<LogOut className="w-4 h-4" />
													<span className="text-sm">ออกจากระบบ</span>
												</button>
											</div>
										</div>
									)}
								</>
							) : (
								<button
									type="button"
									onClick={openPopup}
									className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-800 transition-colors cursor-pointer">
									Sign In
								</button>
							)}
						</div>
					</div>
					<div className="w-full flex justify-end md:hidden">
						<button
							type="button"
							className="text-white"
							onClick={() => setShowMobileMenu(!showMobileMenu)}
						>
							{showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{showMobileMenu && (
				<div className="md:hidden bg-white border-t">
					<div className="px-4 py-3 space-y-3">
						{session ? (
							<div className="space-y-2">
								<div className="flex items-center space-x-3 py-2">
									<div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
										<NextImage
											src={session.user.image ?? `/images/user.png`}
											width={40}
											height={40}
											priority={true}
											alt="User avatar"
											className="w-8 h-8 rounded-full"
										/>
									</div>
									<div>
										<p className="font-semibold text-gray-800">{session.user.name}</p>
									</div>
								</div>
								<button
									type="button"
									onClick={onSignOut} className="w-full text-left py-2 text-red-600 font-medium">
									ออกจากระบบ
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={openPopup}
								className="w-full bg-orange-500 text-white py-2 rounded-full font-medium">
								เข้าสู่ระบบ
							</button>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
