import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false, // False: to fix nextjs not send double request
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.com',
				pathname: '**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				pathname: '**',
			},
		],
	},
};

export default nextConfig;
