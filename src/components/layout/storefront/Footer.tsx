'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
								ส
							</div>
							<h4 className="text-xl font-bold">SECM</h4>
						</div>
						<p className="text-gray-400 text-sm">
							ศูนย์รวมสมุนไพรไทยคุณภาพ และผลิตภัณฑ์การแพทย์แผนไทยคุณภาพสูง
						</p>
					</div>
					<div>
						<h5 className="font-bold mb-4">หมวดหมู่</h5>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<Link href="#" className="hover:text-white transition-colors">
									ยาแผนไทย
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white transition-colors">
									ผลิตภัณฑ์สมุนไพร
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white transition-colors">
									เครื่องมือแพทย์แผนไทย
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h5 className="font-bold mb-4">บริการ</h5>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<Link href="#" className="hover:text-white transition-colors">
									คำปรึกษา
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white transition-colors">
									คำถามที่พบบ่อย
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-white transition-colors">
									บริการหลังการขาย
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h5 className="font-semibold mb-4">ติดต่อเรา</h5>
						<div className="space-y-2 text-gray-400">
							<div className="flex items-center space-x-2 text-sm">
								<Phone className="w-4 h-4" />
								<span>02-123-4567</span>
							</div>
							<div className="flex items-center space-x-2 text-sm">
								<Mail className="w-4 h-4" />
								<span>info@herbmart.com</span>
							</div>
							<div className="flex items-center space-x-2 text-sm">
								<MapPin className="w-4 h-4" />
								<span>กรุงเทพมหานคร</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
