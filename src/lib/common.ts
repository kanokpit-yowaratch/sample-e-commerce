import { Boxes, CircleDollarSign, Home, LucideIcon, Rocket, Shield, Users } from "lucide-react";

export const getImageSrc = (filePath?: string | null): string => {
	if (filePath) {
		// For custom path within project
		// const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3000';
		// return `${baseUrl}/${filePath}`;
		return filePath;
	}
	return '/images/photo-mask.jpg';
};

export const mapIcon = (label: string): LucideIcon => {
	switch (label.toLowerCase()) {
		case 'dashboard':
			return Home;
		case 'users':
			return Users;
		case 'permissions':
			return Shield;
		case 'categories':
			return Boxes;
		case 'products':
			return Rocket;
		case 'orders':
			return CircleDollarSign;
		default:
			return Home;
	}
}
