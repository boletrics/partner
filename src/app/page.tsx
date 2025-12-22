"use client";

import { useEffect, useMemo, useState } from "react";
import { useOrgStore } from "@/lib/org-store";
import { OrgDashboardLayout } from "@/components/org/org-dashboard-layout";
import { OrgViewRouter } from "@/components/org/org-view-router";
import { useThemeEffect } from "@/hooks/use-theme";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import {
	createOrganization,
	listMembers,
	listOrganizations,
} from "@/lib/auth/organizations";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
		addOrganization,
	} = useOrgStore();
	const [isBootstrapped, setIsBootstrapped] = useState(false);
	const [nameInput, setNameInput] = useState("");
	const [slugInput, setSlugInput] = useState("");
	const derivedSlug = useMemo(
		() => slugify(slugInput || nameInput),
		[nameInput, slugInput],
	);
	const [isCreating, setIsCreating] = useState(false);

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
			<div className="flex min-h-screen items-center justify-center px-4">
				<div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
					<div className="space-y-1">
						<p className="text-lg font-semibold">
							Crea tu primera organización
						</p>
						<p className="text-sm text-muted-foreground">
							{error ??
								"Necesitas al menos una organización para continuar. Crea la primera y empezamos."}
						</p>
					</div>

					<div className="space-y-3">
						<div className="space-y-2">
							<label className="text-sm font-medium" htmlFor="org-name">
								Nombre
							</label>
							<Input
								id="org-name"
								placeholder="Mi organización"
								value={nameInput}
								onChange={(e) => setNameInput(e.target.value)}
							/>
						</div>
						<div className="space-y-1">
							<label className="text-sm font-medium" htmlFor="org-slug">
								Slug (URL)
							</label>
							<Input
								id="org-slug"
								placeholder="mi-organizacion"
								value={slugInput}
								onChange={(e) => setSlugInput(e.target.value)}
							/>
							<p className="text-xs text-muted-foreground">
								Slug final:{" "}
								<span className="font-medium">{derivedSlug || "..."}</span>
							</p>
						</div>
						<Button
							className="w-full"
							onClick={async () => {
								if (!nameInput || !derivedSlug) return;
								setIsCreating(true);
								const result = await createOrganization({
									name: nameInput,
									slug: derivedSlug,
								});
								if (result.error || !result.data) {
									toast({
										variant: "destructive",
										title: "No se pudo crear la organización",
										description: result.error || "Intenta nuevamente.",
									});
								} else {
									addOrganization(result.data);
									setCurrentOrg(result.data);
									setError(null);
									toast({
										title: "Organización creada",
										description: `${result.data.name} está lista.`,
									});
								}
								setIsCreating(false);
							}}
							disabled={!nameInput || !derivedSlug || isCreating}
						>
							{isCreating ? "Creando..." : "Crear organización"}
						</Button>
					</div>
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

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
