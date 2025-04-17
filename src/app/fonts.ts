import { Prompt, Kanit } from 'next/font/google';

export const prompt = Prompt({
	subsets: ['thai'],
	weight: ['300', '400', '500', '700'],
	display: 'swap',
	variable: '--font-prompt',
});

export const kanit = Kanit({
	subsets: ['thai'],
	weight: ['300', '400', '500', '700'],
	display: 'swap',
	variable: '--font-kanit',
});
