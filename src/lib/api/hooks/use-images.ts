"use client";

import { useState, useCallback } from "react";
import { apiFetch } from "../client";
import { generateBlurPlaceholder } from "@/lib/image-blur";

export interface UploadUrlResponse {
	uploadURL: string;
	imageId: string;
	deliveryUrl: string;
}

export interface ImageUploadResult {
	imageId: string;
	deliveryUrl: string;
	blurDataUrl: string; // Base64 blur placeholder
}

export interface UseImageUploadOptions {
	context?: "event" | "venue";
	entityId?: string;
	onSuccess?: (result: ImageUploadResult) => void;
	onError?: (error: Error) => void;
}

/**
 * Hook for uploading images to Cloudflare Images via tickets-svc.
 * Uses direct upload flow:
 * 1. Generate blur placeholder from the file
 * 2. Get a one-time upload URL from the backend
 * 3. Upload the file directly to Cloudflare
 * 4. Return the delivery URL and blur placeholder
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<Error | null>(null);

	const upload = useCallback(
		async (file: File): Promise<ImageUploadResult | null> => {
			setIsUploading(true);
			setProgress(0);
			setError(null);

			try {
				// Step 1: Generate blur placeholder (runs in parallel conceptually)
				const blurPromise = generateBlurPlaceholder(file);
				setProgress(10);

				// Step 2: Get upload URL from backend
				const uploadUrlResponse = await apiFetch<UploadUrlResponse>(
					"/images/upload-url",
					{
						method: "POST",
						body: JSON.stringify({
							context: options.context,
							entityId: options.entityId,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				setProgress(30);

				// Step 3: Upload directly to Cloudflare
				const formData = new FormData();
				formData.append("file", file);

				const uploadResponse = await fetch(uploadUrlResponse.uploadURL, {
					method: "POST",
					body: formData,
				});

				if (!uploadResponse.ok) {
					throw new Error("Failed to upload image to Cloudflare");
				}

				setProgress(80);

				// Step 4: Wait for blur to complete
				const blurDataUrl = await blurPromise;
				setProgress(100);

				const result: ImageUploadResult = {
					imageId: uploadUrlResponse.imageId,
					deliveryUrl: uploadUrlResponse.deliveryUrl,
					blurDataUrl,
				};

				options.onSuccess?.(result);
				return result;
			} catch (err) {
				const error = err instanceof Error ? err : new Error("Upload failed");
				setError(error);
				options.onError?.(error);
				return null;
			} finally {
				setIsUploading(false);
			}
		},
		[options],
	);

	return {
		upload,
		isUploading,
		progress,
		error,
	};
}

/**
 * Delete an image from Cloudflare Images.
 */
export async function deleteImage(imageId: string): Promise<void> {
	await apiFetch(`/images/${imageId}`, { method: "DELETE" });
}
