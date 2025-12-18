"use client";

import type React from "react";
import { OrgSidebar } from "@/components/org/org-sidebar";
import { OrgHeader } from "@/components/org/org-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface OrgDashboardLayoutProps {
	children: React.ReactNode;
}

export function OrgDashboardLayout({ children }: OrgDashboardLayoutProps) {
	return (
		<SidebarProvider>
			<OrgSidebar />
			<SidebarInset>
				<OrgHeader />
				<main className="flex-1 overflow-x-hidden overflow-y-auto min-w-0">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
