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
		<div>
			<CategoryGrid categories={categories} />
			<section className="py-8 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<div className="flex flex-col text-center">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							สมุนไพร
							<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
								ไทย
							</span>
						</h2>
						<div className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
							ผลิตภัณฑ์สมุนไพรและการแพทย์แผนไทยคุณภาพสูง
						</div>
						{/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
								เลือกซื้อสมุนไพร
							</button>
							<button className="border border-purple-500 text-purple-700 px-8 py-3 rounded-full hover:bg-purple-50 transition-all">
								เรียนรู้เพิ่มเติม
							</button>
						</div> */}
					</div>
				</div>
			</section>
			<section className="py-8 bg-white/40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 hover:shadow-lg transition-all">
							<div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<Truck className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">จัดส่งปลอดภัย</h3>
							<p className="text-gray-700">บรรจุภัณฑ์มาตรฐาน ส่งถึงบ้านอย่างปลอดภัย</p>
						</div>
						<div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 hover:shadow-lg transition-all">
							<div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">ได้รับรองคุณภาพ</h3>
							<p className="text-gray-700">ผลิตภัณฑ์ผ่านมาตรฐาน อย. และ GMP</p>
						</div>
						<div className="text-center p-6 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 hover:shadow-lg transition-all">
							<div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">ภูมิปัญญาไทย</h3>
							<p className="text-gray-700">สืบทอดสูตรดั้งเดิมจากโบราณ มีประสิทธิภาพ</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default page;
