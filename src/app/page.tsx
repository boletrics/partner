"use client";

import { useEffect } from "react";
import { useOrgStore } from "@/lib/org-store";
import { OrgDashboardLayout } from "@/components/org/org-dashboard-layout";
import { OrgViewRouter } from "@/components/org/org-view-router";
import { useThemeEffect } from "@/hooks/use-theme";
import { mockOrganizations, mockOrgMembers } from "@/lib/org-mock-data";

export default function HomePage() {
	useThemeEffect();
	const {
		currentOrg,
		organizations,
		setCurrentOrg,
		setOrganizations,
		setMembers,
	} = useOrgStore();

	// Initialize with mock data if store is empty (first load only)
	useEffect(() => {
		if (organizations.length === 0) {
			setOrganizations(mockOrganizations);
			setMembers(mockOrgMembers);
		}
	}, [organizations.length, setOrganizations, setMembers]);

	// Auto-select first active organization if none is selected
	useEffect(() => {
		if (!currentOrg && organizations.length > 0) {
			const activeOrg = organizations.find((org) => org.status === "active");
			if (activeOrg) {
				setCurrentOrg(activeOrg);
			} else if (organizations.length > 0) {
				// Fallback to first org if no active org found
				setCurrentOrg(organizations[0]);
			}
		}
	}, [currentOrg, organizations, setCurrentOrg]);

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
