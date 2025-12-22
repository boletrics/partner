import { OrgTeamTable } from "@/components/org/org-team-table";

export default function TeamPage() {
	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Equipo</h1>
				<p className="text-muted-foreground">
					Gestiona los miembros y permisos de tu organización
				</p>
			</div>
			<OrgTeamTable />
		</div>
	);
}
