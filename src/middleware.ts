import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { getAuthLoginUrl } from "@/lib/auth/redirectConfig";

/**
 * Next.js Middleware for route protection.
 *
 * This middleware runs BEFORE the page renders and checks for the existence of
 * a session cookie. If no cookie exists, it redirects to the auth login page.
 *
 * Important: This is an OPTIMISTIC check - it only verifies the cookie exists,
 * not that it's valid. Actual session validation still happens server-side
 * in the page components. This prevents the "blink" effect where users briefly
 * see protected content before being redirected.
 *
 * For cross-subdomain cookies (like .janovix.workers.dev), the cookie will be
 * available to this middleware since it's set on the parent domain.
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Get the session cookie from the request
	// The cookie name matches Better Auth's default: "better-auth.session_token"
	const sessionCookie = getSessionCookie(request);

	// Skip middleware for static files and API routes
	const isStaticFile =
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/api/") ||
		pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/);

	if (isStaticFile) {
		return NextResponse.next();
	}

	// If no session cookie, redirect to auth login page
	if (!sessionCookie) {
		const returnUrl = encodeURIComponent(request.url);
		const loginUrl = getAuthLoginUrl(returnUrl);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	// Apply middleware to all routes except static files and api
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
