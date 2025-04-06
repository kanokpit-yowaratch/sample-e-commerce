export const getImageSrc = (filePath?: string | null): string => {
  if (filePath) {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:3000';
    return `${baseUrl}/${filePath}`;
  }
  return '/images/photo-mask.jpg';
};
