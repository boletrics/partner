import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getServerSession } from "@/lib/auth/getServerSession";
import { SessionHydrator } from "@/lib/auth/useAuthSession";
import { getAuthLoginUrl } from "@/lib/auth/redirectConfig";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Panel de Organización | Boletrics",
	description: "Administra tus eventos, ventas y equipo desde un solo lugar",
};

// Force dynamic rendering since we use cookies and server-side session fetching
export const dynamic = "force-dynamic";

/**
 * Root layout - fetches session on the server and hydrates it for all pages.
 *
 * By fetching the session here and wrapping with SessionHydrator,
 * ALL pages and components have immediate access to the session data
 * without any loading blink.
 *
 * If no valid session is found, redirects to the auth login page with
 * the current URL as a redirect parameter.
 */
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch session on server - this runs before any page renders
	const session = await getServerSession();

	// If no valid session, redirect to login page
	if (!session) {
		// Get the current URL to preserve it for redirect after login
		const headersList = await headers();
		const host = headersList.get("host");
		const protocol = headersList.get("x-forwarded-proto") || "https";
		const referer = headersList.get("referer");

		// Try to get the full URL from referer, or construct from headers
		let currentUrl: string | undefined;
		if (referer && host && referer.includes(host)) {
			currentUrl = referer;
		} else if (host) {
			// Fallback: construct URL from available headers
			const pathname = headersList.get("x-pathname") || "/";
			currentUrl = `${protocol}://${host}${pathname}`;
		}
		// If we can't determine the URL, redirect without return URL parameter

		redirect(getAuthLoginUrl(currentUrl));
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans antialiased`}>
				<SessionHydrator session={session}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</SessionHydrator>
			</body>
		</html>
	);
}
