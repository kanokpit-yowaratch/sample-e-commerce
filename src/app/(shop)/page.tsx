import React from 'react';

import CategoryGrid from '@/components/shop/CategoryGrid';
import { readWithRevalidate } from '@/lib/apiFetcher';
import { Category } from '@prisma/client';
import { Metadata } from 'next';
import { Clock, Shield, Truck } from 'lucide-react';

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
			description: 'คัดสรรสมุนไพรไทยคุณภาพดี หลากหลายชนิดตามต้องการ สะอาด ปลอดภัย',
			images: [{ url: '/images/fresh-chicken-parts.jpg' }],
		},
	};
}

async function page() {
	const categories = await getCategories();
	return (
		<div className="min-h-screen bg-slate-100">
			<CategoryGrid categories={categories} />
			<section className="py-8 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<div className="flex flex-col text-center">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							สมุนไพร
							<span className="bg-linear-to-r from-emerald-500 to-green-700 bg-clip-text text-transparent">
								ไทย
							</span>
						</h2>
						<div className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
							ผลิตภัณฑ์สมุนไพรและการแพทย์แผนไทยคุณภาพสูง
						</div>
					</div>
				</div>
			</section>
			<section className="py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6 rounded-2xl bg-white border border-emerald-100 hover:shadow-lg transition-all">
							<div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<Truck className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">จัดส่งปลอดภัย</h3>
							<p className="text-gray-600">บรรจุภัณฑ์มาตรฐาน ส่งถึงบ้านอย่างปลอดภัย</p>
						</div>
						<div className="text-center p-6 rounded-2xl bg-white border border-emerald-100 hover:shadow-lg transition-all">
							<div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">ได้รับรองคุณภาพ</h3>
							<p className="text-gray-600">ผลิตภัณฑ์ผ่านมาตรฐาน อย. และ GMP</p>
						</div>
						<div className="text-center p-6 rounded-2xl bg-white border border-emerald-100 hover:shadow-lg transition-all">
							<div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">ภูมิปัญญาไทย</h3>
							<p className="text-gray-600">สืบทอดสูตรดั้งเดิมจากโบราณ มีประสิทธิภาพ</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default page;
