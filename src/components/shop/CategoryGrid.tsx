'use client';

import React from 'react';
import { Category } from '@prisma/client';
import Link from 'next/link';

function CategoryGrid({ categories }: Readonly<{ categories: Category[] }>) {
	return (
		<section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
			<h2 className="text-2xl font-bold mb-8 text-emerald-800">สมุนไพรไทย</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories?.map((category) => (
					<Link href={`/category/${category.name}`} key={category.name}>
						<div
							key={category.id}
							className="h-42 relative overflow-hidden rounded-lg bg-sky-100 border-0 hover:bg-teal-100 transition-all">
							<div className="absolute -bottom-10 -right-10 z-0 opacity-50 w-32 h-32 bg-[url('/leaf-on-branch.svg')] bg-contain bg-no-repeat"></div>
							<div className="relative z-1 flex items-center justify-center h-full p-4">
								<span className="text-lg font-semibold text-teal-700 text-center">{category.name}</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

export default CategoryGrid;
