// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: "dzlssgfz9",
  uploadPreset: "Sreerasthunew",
};

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;

// Helper to generate optimized image URLs
export const getOptimizedImageUrl = (url: string, options?: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}) => {
  if (!url) return '';

  // The old cloud name is no longer needed here, so we can remove the replacement logic.
  const updatedUrl = url;

  if (!updatedUrl.includes('cloudinary')) return updatedUrl;
  
  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  // Insert transformations after /upload/
  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    'c_limit'
  ].filter(Boolean).join(',');
  
  // Ensure transformations are applied correctly, even if they were already present
  if (updatedUrl.includes('/upload/q_auto,f_auto') || updatedUrl.match(/\/upload\/f_auto,q_auto/)) {
     return updatedUrl.replace(/upload\/([^/]+)/, `upload/${transformations}`);
  }
  
  if (updatedUrl.match(/\/upload\/v[0-9]+/)) {
     return updatedUrl.replace(/(\/upload\/)/, `$1${transformations}/`);
  }

  return updatedUrl.replace('/upload/', `/upload/${transformations}/`);
};
