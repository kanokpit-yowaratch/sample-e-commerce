'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useLoginStore } from '@/stores/zustand/loginStore';
import { X } from 'lucide-react';

const LoginPopup = () => {
	const { isOpen, closePopup } = useLoginStore();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
				<button
					onClick={closePopup}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
					<X size={24} />
				</button>

				<div className="flex justify-center mb-6">
					<div className="bg-gray-900 dark:bg-gray-700 rounded-full p-4 w-16 h-16 flex items-center justify-center">
						<div className="text-blue-500 font-bold text-2xl">Logo</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Sign In</h2>

				<div className="space-y-4">
					<button
						onClick={() => signIn('google')}
						className="flex items-center justify-center w-full gap-3 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-gray-800 font-medium transition duration-150">
						<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
							<g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
								<path
									fill="#4285F4"
									d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
								/>
								<path
									fill="#34A853"
									d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
								/>
								<path
									fill="#FBBC05"
									d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
								/>
								<path
									fill="#EA4335"
									d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
								/>
							</g>
						</svg>
						Continue with Google
					</button>

					{/* <button
						onClick={() => signIn("facebook")}
						className="flex items-center justify-center w-full gap-3 py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] border border-[#1877F2] rounded-md text-white font-medium transition duration-150"
					>
						<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
						</svg>
						Continue with Facebook
					</button> */}

					<button
						onClick={() => signIn('github')}
						className="flex items-center justify-center w-full gap-3 py-3 px-4 bg-black hover:bg-gray-900 border border-black rounded-md text-white font-medium transition duration-150">
						<svg
							viewBox="0 0 24 24"
							width="24"
							height="24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.284 9.521 21.026C9.521 20.791 9.513 20.014 9.508 19.241C6.726 19.861 6.139 17.966 6.139 17.966C5.685 16.913 5.026 16.618 5.026 16.618C4.119 16.025 5.095 16.038 5.095 16.038C6.102 16.111 6.639 17.031 6.639 17.031C7.541 18.431 8.974 18.015 9.539 17.765C9.63 17.151 9.889 16.736 10.175 16.519C7.954 16.3 5.62 15.468 5.62 11.72C5.62 10.626 6.01 9.733 6.658 9.033C6.555 8.786 6.208 7.795 6.758 6.513C6.758 6.513 7.607 6.252 9.497 7.503C10.295 7.29 11.15 7.183 12 7.179C12.85 7.183 13.705 7.29 14.504 7.503C16.393 6.252 17.242 6.513 17.242 6.513C17.792 7.795 17.445 8.786 17.342 9.033C17.991 9.733 18.38 10.626 18.38 11.72C18.38 15.476 16.042 16.298 13.816 16.513C14.172 16.779 14.491 17.31 14.491 18.116C14.491 19.282 14.479 20.699 14.479 21.026C14.479 21.287 14.659 21.586 15.167 21.486C19.137 20.161 22 16.416 22 12C22 6.477 17.523 2 12 2Z" />
						</svg>
						Continue with GitHub
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginPopup;
