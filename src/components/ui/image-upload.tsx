"use client";

import {
	useState,
	useCallback,
	useRef,
	type DragEvent,
	type ChangeEvent,
} from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
	useImageUpload,
	type ImageUploadResult,
} from "@/lib/api/hooks/use-images";

export interface ImageUploadValue {
	url: string;
	blur?: string; // Base64 blur placeholder
}

export interface ImageUploadProps {
	/** Current image URL (for showing preview) */
	value?: string;
	/** Called when image is uploaded or cleared - includes blur data */
	onChange?: (value: ImageUploadValue | undefined) => void;
	/** Context for the upload (event, venue) */
	context?: "event" | "venue";
	/** Entity ID to associate with the image */
	entityId?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Aspect ratio for preview (e.g., "16/9", "1/1") */
	aspectRatio?: string;
	/** Additional class name */
	className?: string;
	/** Accepted file types */
	accept?: string;
	/** Max file size in bytes (default 10MB) */
	maxSize?: number;
	/** Disabled state */
	disabled?: boolean;
}

export function ImageUpload({
	value,
	onChange,
	context,
	entityId,
	placeholder = "Click or drag to upload an image",
	aspectRatio = "16/9",
	className,
	accept = "image/jpeg,image/png,image/gif,image/webp",
	maxSize = 10 * 1024 * 1024, // 10MB
	disabled = false,
}: ImageUploadProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { upload, isUploading, progress } = useImageUpload({
		context,
		entityId,
		onSuccess: (result: ImageUploadResult) => {
			setPreviewUrl(result.deliveryUrl);
			onChange?.({
				url: result.deliveryUrl,
				blur: result.blurDataUrl,
			});
			setUploadError(null);
		},
		onError: (error) => {
			setUploadError(error.message);
		},
	});

	const handleFile = useCallback(
		async (file: File) => {
			// Validate file type
			const validTypes = accept.split(",").map((t) => t.trim());
			if (!validTypes.includes(file.type)) {
				setUploadError(`Invalid file type. Accepted: ${accept}`);
				return;
			}

			// Validate file size
			if (file.size > maxSize) {
				setUploadError(
					`File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`,
				);
				return;
			}

			setUploadError(null);

			// Create local preview immediately
			const localPreview = URL.createObjectURL(file);
			setPreviewUrl(localPreview);

			// Upload to Cloudflare
			const result = await upload(file);

			// Clean up local preview if upload succeeded
			if (result) {
				URL.revokeObjectURL(localPreview);
			}
		},
		[accept, maxSize, upload],
	);

	const handleDragOver = useCallback((e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (disabled || isUploading) return;

			const file = e.dataTransfer.files[0];
			if (file) {
				handleFile(file);
			}
		},
		[disabled, isUploading, handleFile],
	);

	const handleInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				handleFile(file);
			}
			// Reset input so same file can be selected again
			e.target.value = "";
		},
		[handleFile],
	);

	const handleClick = useCallback(() => {
		if (disabled || isUploading) return;
		fileInputRef.current?.click();
	}, [disabled, isUploading]);

	const handleRemove = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setPreviewUrl(undefined);
			onChange?.(undefined);
		},
		[onChange],
	);

	return (
		<div className={cn("relative", className)}>
			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				onChange={handleInputChange}
				className="hidden"
				disabled={disabled || isUploading}
			/>

			<div
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
					isDragging
						? "border-primary bg-primary/10"
						: "border-muted-foreground/25 hover:border-primary/50",
					(disabled || isUploading) && "cursor-not-allowed opacity-50",
					!previewUrl && "bg-muted/30",
				)}
				style={{ aspectRatio }}
			>
				{previewUrl ? (
					<>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={previewUrl}
							alt="Preview"
							className="h-full w-full object-cover"
						/>
						{!isUploading && !disabled && (
							<Button
								variant="destructive"
								size="icon"
								className="absolute right-2 top-2 h-8 w-8"
								onClick={handleRemove}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</>
				) : (
					<div className="flex flex-col items-center gap-2 p-6 text-center text-muted-foreground">
						<ImageIcon className="h-10 w-10" />
						<p className="text-sm">{placeholder}</p>
						<p className="text-xs">
							Max size: {Math.round(maxSize / 1024 / 1024)}MB
						</p>
					</div>
				)}

				{isUploading && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="mt-2 text-sm font-medium">{progress}%</p>
					</div>
				)}
			</div>

			{uploadError && (
				<p className="mt-2 text-sm text-destructive">{uploadError}</p>
			)}
		</div>
	);
}
