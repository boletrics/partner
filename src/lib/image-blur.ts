/**
 * Generates a small base64-encoded blur placeholder image from a File.
 *
 * The placeholder is a very small image (10x10 pixels) that can be used
 * as the blurDataURL for Next.js Image component for instant loading.
 */

const BLUR_SIZE = 10; // 10x10 pixels is enough for a blur effect

/**
 * Generate a base64 blur placeholder from a File.
 *
 * @param file - The image file to generate a blur placeholder from
 * @returns Promise with the base64 data URL
 */
export async function generateBlurPlaceholder(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Could not get canvas context"));
			return;
		}

		img.onload = () => {
			// Set canvas to blur size
			canvas.width = BLUR_SIZE;
			canvas.height = BLUR_SIZE;

			// Draw image scaled down to blur size
			ctx.drawImage(img, 0, 0, BLUR_SIZE, BLUR_SIZE);

			// Convert to base64
			// Using JPEG for smaller size, quality 0.7 is enough for blur
			const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

			// Clean up
			URL.revokeObjectURL(img.src);

			resolve(dataUrl);
		};

		img.onerror = () => {
			URL.revokeObjectURL(img.src);
			reject(new Error("Failed to load image"));
		};

		// Load the file
		img.src = URL.createObjectURL(file);
	});
}

/**
 * Generate a blur placeholder from an image URL.
 * Note: This only works for same-origin or CORS-enabled images.
 *
 * @param url - The image URL
 * @returns Promise with the base64 data URL, or null if failed
 */
export async function generateBlurFromUrl(url: string): Promise<string | null> {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const file = new File([blob], "image", { type: blob.type });
		return generateBlurPlaceholder(file);
	} catch {
		console.warn("Could not generate blur placeholder from URL:", url);
		return null;
	}
}
