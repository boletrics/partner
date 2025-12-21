import type React from "react";
import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getServerSession } from "@/lib/auth/getServerSession";
import { SessionHydrator } from "@/lib/auth/useAuthSession";
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
 */
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch session on server - this runs before any page renders
	const session = await getServerSession();

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
