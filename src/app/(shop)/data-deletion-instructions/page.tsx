'use client';

import { useState } from 'react';

export default function UserDataDeletionPage() {
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [exportRequested, setExportRequested] = useState(false);

	const handleExportData = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setExportRequested(true);
		}, 1500);
	};

	const handleDeleteAccount = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			setStep(3);
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-4xl mx-auto px-4">
				<div className="mb-8 flex justify-between items-center">
					<h1 className="text-3xl font-bold text-gray-900">ลบข้อมูลส่วนตัว / Delete Personal Data</h1>
				</div>
				<div className="bg-white shadow rounded-lg overflow-hidden">
					{step === 1 && (
						<div className="p-6">
							<h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัวของคุณ / Your Personal Data</h2>

							<div className="mb-6">
								<h3 className="font-medium mb-2">ไทย</h3>
								<p className="text-gray-600 mb-4">
									ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
									คุณมีสิทธิ์ในการขอให้ลบข้อมูลส่วนตัวของคุณจากระบบของเรา ก่อนดำเนินการ
									คุณอาจต้องการส่งออกข้อมูลของคุณก่อน
									เนื่องจากข้อมูลทั้งหมดจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้
								</p>

								<h3 className="font-medium mb-2">English</h3>
								<p className="text-gray-600 mb-4">
									According to the Personal Data Protection Act (PDPA), you have the right to request the
									deletion of your personal data from our systems. Before proceeding, you may want to export
									your data first, as all data will be permanently deleted and cannot be recovered.
								</p>
							</div>

							<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
								<div className="flex">
									<div className="ml-3">
										<p className="text-sm text-yellow-700">
											<span className="font-medium">คำเตือน / Warning:</span> การลบข้อมูลเป็นการดำเนินการถาวร
											<br />
											This deletion is permanent
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<h3 className="font-medium mb-2">ข้อมูลที่จะถูกลบ / Data to be deleted:</h3>
									<ul className="list-disc pl-5 text-gray-600 space-y-1">
										<li>
											ข้อมูลส่วนตัว (ชื่อ, ที่อยู่, อีเมล) / Personal information (name, address, email)
										</li>
										<li>ประวัติการสั่งซื้อ / Order history</li>
										<li>การตั้งค่าบัญชี / Account settings</li>
										<li>ข้อมูลการชำระเงิน / Payment information</li>
									</ul>
								</div>

								<div>
									<h3 className="font-medium mb-2">ข้อมูลที่จะยังคงอยู่ / Data that will remain:</h3>
									<ul className="list-disc pl-5 text-gray-600 space-y-1">
										<li>บันทึกการทำธุรกรรมที่จำเป็นตามกฎหมาย / Transaction records required by law</li>
										<li>ข้อมูลนิรนามเพื่อการวิเคราะห์ / Anonymized data for analytics</li>
									</ul>
								</div>
							</div>

							<div className="mt-8 space-y-4">
								{!exportRequested ? (
									<button
										onClick={handleExportData}
										disabled={isLoading}
										className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50">
										{isLoading ? (
											<span className="flex items-center">
												<svg
													className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24">
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												กำลังดำเนินการ... / Processing...
											</span>
										) : (
											<>ส่งออกข้อมูลของฉัน / Export my data</>
										)}
									</button>
								) : (
									<div className="text-green-600 flex items-center justify-center space-x-2 py-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span>ข้อมูลถูกส่งทางอีเมลแล้ว / Data has been emailed to you</span>
									</div>
								)}

								<button
									onClick={() => handleDeleteAccount()}
									className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
									ดำเนินการต่อเพื่อลบข้อมูล / Continue to delete data
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
