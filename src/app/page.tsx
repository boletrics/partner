"use client";

import { useEffect } from "react";
import { useOrgStore } from "@/lib/org-store";
import { OrgDashboardLayout } from "@/components/org/org-dashboard-layout";
import { OrgViewRouter } from "@/components/org/org-view-router";
import { useThemeEffect } from "@/hooks/use-theme";

export default function HomePage() {
	useThemeEffect();
	const { currentOrg } = useOrgStore();

	if (!currentOrg) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">
						Cargando panel de organización...
					</p>
				</div>
			</div>
		);
	}

	return (
		<OrgDashboardLayout>
			<OrgViewRouter />
		</OrgDashboardLayout>
	);
}
