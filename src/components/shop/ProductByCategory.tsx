'use client';

import { useState } from 'react';
import { NameParams } from '@/types/common';
import Link from 'next/link';
import { useItem } from '@/hooks/useQueryStoreFront';
import NextImage from 'next/image';
import { getImageSrc } from '@/lib/common';
import { CategoryWithProducts } from '@/types/category';
import { ProductDetail } from '@/types/product';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function ProductByCategory({ name }: Readonly<NameParams>) {
	const { data } = useItem<CategoryWithProducts>('categories', name);
	const [activeTab, setActiveTab] = useState<'popular' | 'latest' | 'topSales'>('popular');

	return (
		<div className="max-w-6xl mx-auto bg-gray-100 min-h-screen">
			<div className="flex">
				<div className="w-64 bg-white p-4">
					<div className="flex items-center text-gray-700 mb-6 font-medium">
						<span className="mr-2">≡</span>
						<span>All Categories</span>
					</div>

					<div className="mb-4">
						<div className="flex items-center text-fuchsia-500 font-medium mb-3">
							<span className="mr-1">▶</span>
							<span>{decodeURIComponent(name)}</span>
						</div>

						<div className="space-y-3 ml-3 text-gray-700">
							<div>Sneakers</div>
							<div>Oxford</div>
							<div>Slip-Ons & Mules</div>
							<div>Boots</div>
							<div>Loafers</div>
							<div className="flex items-center">
								<span>More</span>
								<span className="ml-1">▼</span>
							</div>
						</div>
					</div>

					<div className="border-t pt-4">
						<div className="flex items-center text-gray-700 font-medium">
							<Filter size={18} className="mr-2" />
							<span>SEARCH FILTER</span>
						</div>
					</div>
				</div>

				<div className="flex-1 px-4 py-4">
					<div className="flex mb-4 text-sm">
						<div className="mr-2 flex items-center text-gray-700">Sort by</div>

						<div className="flex">
							<button
								className={`px-6 py-2 ${activeTab === 'popular' ? 'bg-fuchsia-500 text-white' : 'bg-white text-gray-700'}`}
								onClick={() => setActiveTab('popular')}>
								Popular
							</button>
							<button
								className={`px-6 py-2 ${activeTab === 'latest' ? 'bg-fuchsia-500 text-white' : 'bg-white text-gray-700'}`}
								onClick={() => setActiveTab('latest')}>
								Latest
							</button>
							<button
								className={`px-6 py-2 ${activeTab === 'topSales' ? 'bg-fuchsia-500 text-white' : 'bg-white text-gray-700'}`}
								onClick={() => setActiveTab('topSales')}>
								Top Sales
							</button>

							<button className="flex items-center justify-between px-6 py-2 bg-white text-gray-700 w-48">
								<span>Price</span>
								<span>▼</span>
							</button>
						</div>

						<div className="ml-auto flex items-center">
							<span className="text-fuchsia-500">1</span>
							<span className="text-gray-500">/9</span>
							<button className="ml-4 px-2 py-1 bg-white text-gray-400">
								<ChevronLeft size={16} />
							</button>
							<button className="px-2 py-1 bg-white text-gray-700">
								<ChevronRight size={16} />
							</button>
						</div>
					</div>

					<div className="grid grid-cols-5 gap-4">
						{data?.products?.map((product: ProductDetail) => (
							<Link href={`/product/${product.name}`} key={product.name}>
								<div key={product.id} className="bg-white rounded shadow-sm relative">
									<div className="relative h-48 overflow-hidden">
										<NextImage
											src={getImageSrc(product.images[0]?.filePath)}
											fill={true}
											objectFit="cover"
											priority={true}
											alt="Product cover"
											className="w-full h-auto"
										/>
									</div>
									<div className="p-3 border-t">
										<div className="text-xs text-gray-700 mb-1 line-clamp-2">
											{product.name} {product.description}
										</div>
										<div className="flex items-center mb-1">
											<span className="text-fuchsia-500 font-medium">฿{product.price}</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
