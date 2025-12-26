import type React from "react";
import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getServerSession } from "@/lib/auth/getServerSession";
import { SessionHydrator } from "@/lib/auth/useAuthSession";
import { SwrProvider } from "@/lib/api/swr-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Panel de Organización | Boletrics",
	description: "Administra tus eventos, ventas y equipo desde un solo lugar",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans antialiased`}>
				<SessionHydrator serverSession={session}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<SwrProvider>{children}</SwrProvider>
					</ThemeProvider>
				</SessionHydrator>
			</body>
		</html>
	);
}
