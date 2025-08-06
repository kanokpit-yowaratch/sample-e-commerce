import React from 'react';

import CategoryGrid from '@/components/shop/CategoryGrid';
import FeaturedProducts from '@/components/shop/FeaturedProducts';
import { readWithRevalidate } from '@/lib/apiFetcher';
import { Category } from '@prisma/client';
import { Metadata } from 'next';

async function getCategories(): Promise<Category[] | []> {
	try {
		const categories = await readWithRevalidate<Category[]>(
			`${process.env.API_URL}/api/storefront/categories`,
		);
		return categories;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'สมุนไพรไทยแท้ คุณภาพดี สะอาด ปลอดภัย ได้มาตรฐาน',
		description: 'คัดสรรสมุนไพรไทยคุณภาพดี หลากหลายชนิดตามต้องการ สะอาด ปลอดภัย',
		openGraph: {
			title: 'สมุนไพรไทยแท้ คุณภาพดี สะอาด ปลอดภัย ได้มาตรฐาน',
			description:
				'คัดสรรสมุนไพรไทยคุณภาพดี หลากหลายชนิดตามต้องการ สะอาด ปลอดภัย',
			images: [{ url: '/images/fresh-chicken-parts.jpg' }],
		},
	};
}

async function page() {
	const categories = await getCategories();
	return (
		<>
			<CategoryGrid categories={categories} />
			<FeaturedProducts />
		</>
	);
}

export default page;
