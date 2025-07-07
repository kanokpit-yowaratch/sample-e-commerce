'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import useCartStore from '@/stores/zustand/useCartStore';
import { ProductCart } from '@/types/product';
import { ProductParams } from '@/types/common';
import NextImage from 'next/image';
import { getImageSrc } from '@/lib/common';
import { MinusIcon, PlusIcon, ShoppingCartIcon, TruckIcon } from 'lucide-react';
import { useLoginStore } from '@/stores/zustand/loginStore';
import { useRouter } from 'next/navigation';
import useBuyNowStore from '@/stores/zustand/useBuyNowStore';

export default function ProductDetailCp({ product }: Readonly<ProductParams>) {
	const { data: session } = useSession();
	const { addToCart } = useCartStore();
	const { addToBuyNow } = useBuyNowStore();
	const { openPopup } = useLoginStore();
	const [totalQuantity, setTotalQuantity] = useState<number>(1);
	const router = useRouter();

	const incrementQuantity = () => {
		setTotalQuantity((prev) => prev + 1);
	};

	const decrementQuantity = () => {
		if (totalQuantity > 1) {
			setTotalQuantity((prev) => prev - 1);
		}
	};

	const addProductToCart = () => {
		if (product) {
			const productCart: ProductCart = {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: totalQuantity,
				image: product.images[0]?.filePath,
			};
			addToCart(productCart);
			setTotalQuantity(1);
		}
	};

	const onCheckOut = () => {
		if (session && product) {
			const productCart: ProductCart = {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: totalQuantity,
				image: product.images[0]?.filePath,
			};
			addToBuyNow(productCart);
			router.push('/checkout?from=buynow');
		} else if (!session && product) {
			openPopup();
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* <Breadcrumb items={product.breadcrumb} /> */}

			<div className="flex flex-col md:flex-row gap-8 mt-6">
				{/* Product Image Section */}
				<div className="md:w-1/2 relative">
					<div className="sticky top-4">
						<div className="relative h-96 md:h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden">
							<NextImage
								src={getImageSrc(product?.images[0]?.filePath)}
								alt={product?.name ?? ''}
								fill
								className="object-contain"
								priority
							/>
						</div>

						{/* <div className="flex mt-4 gap-2">
              {product?.thumbnails.map((thumb, idx) => (
                <div key={idx} className="w-16 h-16 border border-red-500 rounded cursor-pointer">
                  <div className="relative h-full w-full">
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div> */}

						{/* <div className="mt-4">
              <ShareButtons />
            </div> */}
					</div>
				</div>

				{/* Product Details Section */}
				<div className="md:w-1/2">
					{/* {product.preferred && (
            <span className="inline-block px-3 py-1 bg-fuchsia-500 text-white text-sm font-medium rounded">
              Preferred
            </span>
          )} */}

					<h1 className="text-xl md:text-2xl font-medium mt-2">{product?.name}</h1>

					<div className="flex items-center mt-4 gap-4">
						{/* <div className="flex items-center">
              <span className="text-lg font-bold">{product.rating}</span>
              <div className="flex text-yellow-400 ml-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
            </div> */}

						{/* <div className="text-gray-500 border-l border-gray-300 pl-4">
              <span>{product.reviews} Ratings</span>
            </div> */}

						{/* <div className="text-gray-500 border-l border-gray-300 pl-4">
              <span>{product.sold} Sold</span>
            </div> */}

						{/* <button onClick={() => { }} className="text-gray-500 ml-auto">
              Report
            </button> */}
					</div>

					<div className="mt-6 p-4 bg-gray-50 rounded">
						<div className="flex items-center">
							<div className="text-3xl font-bold text-fuchsia-500">{product?.price} ฿</div>
							{/* <div className="text-3xl font-bold text-fuchsia-500">
                {product.currentPrice}
              </div>
              <div className="ml-4 line-through text-gray-400">
                {product.originalPrice}
              </div>
              <div className="ml-2 text-fuchsia-500">
                -{product.discount}
              </div> */}
						</div>
					</div>

					<div className="mt-6 grid grid-cols-1 gap-4">
						<div className="flex items-center">
							<span className="w-48 text-gray-500">Shipping</span>
							<div>
								<div className="flex items-center">
									<TruckIcon className="w-5 h-5 text-teal-500 mr-2" />
									<span className="font-medium">Guaranteed to get by Today</span>
									<span className="text-teal-500 ml-1">›</span>
								</div>
								{/* <div className="text-sm text-gray-500 mt-1">
                  Get a ฿{product.voucherAmount} voucher if your order arrives late.
                </div> */}
							</div>
						</div>

						<div className="flex items-center">
							<span className="w-48 text-gray-500">Shopping Guarantee</span>
							<div className="flex items-center">
								<div className="w-5 h-5 text-fuchsia-500 mr-2">♥</div>
								<span>Cheapest on Shopee · Cash On Delivery</span>
							</div>
						</div>

						{/* <div className="flex items-start">
              <span className="w-24 text-gray-500 pt-2">สี</span>
              <div className="flex flex-wrap gap-2">
                <ProductColorSelector colors={product.colors} />
              </div>
            </div> */}

						<div className="flex items-center">
							<span className="w-48 text-gray-500">Quantity</span>
							<div className="flex items-center">
								<button
									onClick={decrementQuantity}
									className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l">
									<MinusIcon className="w-4 h-4" />
								</button>
								<input
									type="text"
									value={totalQuantity}
									onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 1)}
									className="w-12 h-8 text-center border-t border-b border-gray-300"
								/>
								<button
									onClick={incrementQuantity}
									className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r">
									<PlusIcon className="w-4 h-4" />
								</button>
								{/* <span className="ml-4 text-gray-500">
                  {product.stocks.available} pieces available
                </span> */}
							</div>
						</div>
					</div>

					<div className="mt-8 flex gap-4">
						<button
							className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-fuchsia-500 text-fuchsia-500 rounded-sm hover:bg-fuchsia-50 transition-colors"
							onClick={() => addProductToCart()}>
							<ShoppingCartIcon className="w-5 h-5" />
							Add To Cart
						</button>
						<button
							className={`flex-1 px-6 py-3 text-white rounded-sm bg-fuchsia-500 hover:bg-fuchsia-600 cursor-pointer transition-colors`}
							onClick={() => onCheckOut()}
						>
							Buy Now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
