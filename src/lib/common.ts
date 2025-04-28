export const getImageSrc = (filePath?: string | null): string => {
	if (filePath) {
		// For custom path within project
		// const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3000';
		// return `${baseUrl}/${filePath}`;
		return filePath;
	}
	return '/images/photo-mask.jpg';
};
