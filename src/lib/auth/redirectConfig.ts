import { getAuthAppUrl } from "./authCoreConfig";

/**
 * Gets the default redirect URL after successful authentication.
 *
 * This is used when no `redirect_to` query parameter is provided.
 * Configure via NEXT_PUBLIC_AUTH_REDIRECT_URL environment variable.
 *
 * @returns The default redirect URL (e.g., https://app.example.workers.dev)
 */
export const getDefaultRedirectUrl = (): string => {
	return (
		process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ||
		process.env.NEXT_PUBLIC_APP_URL ||
		"https://app.example.workers.dev"
	);
};

/**
 * Determines the redirect URL to use after successful authentication.
 *
 * Priority:
 * 1. `redirect_to` query parameter (if provided)
 * 2. `NEXT_PUBLIC_AUTH_REDIRECT_URL` environment variable
 * 3. Fallback to "https://app.example.workers.dev"
 *
 * @param redirectTo - The redirect_to query parameter value (if any)
 * @returns The URL to redirect to after authentication
 */
export const getAuthRedirectUrl = (redirectTo?: string): string => {
	if (redirectTo) {
		return redirectTo;
	}
	return getDefaultRedirectUrl();
};

/**
 * Gets the auth app login URL with optional redirect parameter.
 *
 * @param redirectTo - Optional URL to redirect to after login
 * @returns The login URL with redirect parameter if provided
 */
export const getAuthLoginUrl = (redirectTo?: string): string => {
	const authAppUrl = getAuthAppUrl();
	const loginUrl = new URL("/login", authAppUrl);

	if (redirectTo) {
		loginUrl.searchParams.set("redirect_to", redirectTo);
	}

	return loginUrl.toString();
};
