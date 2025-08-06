'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
	interface Window {
		promptparse: {
			generate: {
				anyId: (options: { type: string; target: string; amount?: number }) => string;
			};
			parse: (qrString: string) => {
				getTagValue: (tagId: string) => string;
			};
		};
	}
}

export default function PromptpayGenerator({ total }: Readonly<{ total: number }>) {
	const [isLoaded, setIsLoaded] = useState(false);
	const scriptLoadedRef = useRef(false);
	const [promptPayId, setPromptPayId] = useState<string>('');
	// const [mobileNo, setMobileNo] = useState<string>('');
	const [payload, setPayload] = useState<string>('');

	const loadPromptparseScript = () => {
		if (scriptLoadedRef.current) return;
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/promptparse';
		script.async = true;
		script.onload = () => {
			scriptLoadedRef.current = true;
			setIsLoaded(true);
		};
		script.onerror = () => {
			console.error('Failed to load PromptParse');
		};
		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	};

	useEffect(() => {
		loadPromptparseScript();
		const idCard = process.env.NEXT_PUBLIC_ID_CARD ?? '';
		// const phone = process.env.NEXT_PUBLIC_MOBILE ?? '';
		setPromptPayId(idCard);
		// setMobileNo(phone);
	}, []);

	useEffect(() => {
		if (Number(total) > 0) {
			const baseOptions = { type: 'NATID', target: promptPayId, amount: Number(total) };
			const pl = window.promptparse?.generate.anyId(baseOptions);
			setPayload(pl);
		}
	}, [total, window.promptparse]);

	if (!isLoaded) {
		return (
			<div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading PromptParse...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto bg-white">
			<h2 className="text-xl font-bold text-gray-900 mb-2 text-center">พร้อมเพย์ QR Code</h2>
			{payload && (
				<div className="flex flex-col justify-center items-center space-y-1">
					<div className="flex items-center justify-center gap-2">
						<span className="font-medium">จำนวน:</span>
						<span className="text-lg text-blue-700 font-bold">{total.toFixed(2)}</span>
						<span>฿</span>
					</div>
					<div className="bg-white rounded-xl p-4 inline-block">
						<img
							src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}&margin=0`}
							alt="Generated QR Code"
							className="rounded-lg shadow-md"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
