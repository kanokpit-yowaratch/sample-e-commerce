'use client';

import { useState } from 'react';
import { CartItemProps } from '@/types/cart';
import { Trash2Icon } from 'lucide-react';
import NextImage from 'next/image';

export default function CartItemComponent({ item, onQuantityChange, onRemove }: Readonly<CartItemProps>) {
	const [quantity, setQuantity] = useState(item.quantity);

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity > 0) {
			setQuantity(newQuantity);
			onQuantityChange(item.id, newQuantity);
		}
	};

	return (
		<div className="border-b py-4 px-4">
			<div className="flex items-center gap-4 mt-2">
				<div className="relative w-20 h-20 flex-shrink-0">
					<div className="bg-gray-100 w-full h-full flex items-center justify-center rounded">
						<div className="bg-gray-200 w-16 h-16 rounded">
							{item.image && (
								<NextImage
									src={item.image}
									fill={true}
									objectFit="cover"
									priority={true}
									alt="Product cover"
									className="w-full h-auto"
								/>
							)}
						</div>
					</div>
				</div>

				<div className="flex-grow">
					<div className="flex items-center justify-between text-sm font-normal line-clamp-2">
						<span>{item.name}</span>
						<button
							onClick={() => onRemove(item.id)}
							className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors">
							<Trash2Icon size={18} />
						</button>
					</div>
					<div className="flex items-center justify-between mt-2">
						<div className="text-orange-500 font-medium">฿{item.price.toFixed(2)}</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => handleQuantityChange(quantity - 1)}
								className="w-6 h-6 flex items-center justify-center border rounded">
								-
							</button>
							<span className="w-8 text-center">{quantity}</span>
							<button
								onClick={() => handleQuantityChange(quantity + 1)}
								className="w-6 h-6 flex items-center justify-center border rounded">
								+
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
