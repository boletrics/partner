"use client";

import { useEffect, useMemo, useState } from "react";
import { useOrgStore } from "@/lib/org-store";
import { OrgDashboardLayout } from "@/components/org/org-dashboard-layout";
import { OrgViewRouter } from "@/components/org/org-view-router";
import { useThemeEffect } from "@/hooks/use-theme";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { listMembers, listOrganizations } from "@/lib/auth/organizations";
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
	useThemeEffect();
	const { toast } = useToast();
	const { data: session } = useAuthSession();
	const {
		currentOrg,
		organizations,
		setCurrentOrg,
		setOrganizations,
		setMembers,
		setLoading,
		setError,
		isLoading,
		error,
		setCurrentUserId,
	} = useOrgStore();
	const [isBootstrapped, setIsBootstrapped] = useState(false);

	useEffect(() => {
		if (session?.user?.id) {
			setCurrentUserId(session.user.id);
		}
	}, [session?.user?.id, setCurrentUserId]);

	// Bootstrap organizations from auth-svc
	useEffect(() => {
		let cancelled = false;
		async function bootstrap() {
			setLoading(true);
			setError(null);

			const result = await listOrganizations();
			if (cancelled) return;

			if (result.error || !result.data) {
				setError(result.error || "No se pudieron cargar las organizaciones");
				toast({
					variant: "destructive",
					title: "Error al cargar organizaciones",
					description: result.error || "Intenta nuevamente más tarde.",
				});
				setLoading(false);
				return;
			}

			const nextOrgs = result.data.organizations;
			setOrganizations(nextOrgs);

			const active =
				nextOrgs.find((org) => org.id === result.data?.activeOrganizationId) ??
				nextOrgs[0] ??
				null;
			setCurrentOrg(active ?? null);

			if (active) {
				const membersResult = await listMembers(active.id);
				if (!cancelled) {
					if (membersResult.data) {
						setMembers(membersResult.data);
					} else if (membersResult.error) {
						toast({
							variant: "destructive",
							title: "No se pudieron cargar los miembros",
							description: membersResult.error,
						});
					}
				}
			}

			setIsBootstrapped(true);
			setLoading(false);
		}

		bootstrap();
		return () => {
			cancelled = true;
		};
	}, [
		setCurrentOrg,
		setMembers,
		setOrganizations,
		setError,
		setLoading,
		toast,
	]);

	const showLoading = useMemo(
		() => isLoading || (!isBootstrapped && organizations.length === 0),
		[isBootstrapped, isLoading, organizations.length],
	);

	if (showLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Cargando organizaciones...</p>
				</div>
			</div>
		);
	}

	if (!currentOrg || error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center space-y-3 max-w-md px-4">
					<p className="text-lg font-semibold">No hay organizaciones</p>
					<p className="text-muted-foreground">
						{error ??
							"Conéctate al servicio de autenticación para ver tus organizaciones."}
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
