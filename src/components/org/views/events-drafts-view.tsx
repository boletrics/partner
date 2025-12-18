"use client";

import { FileText, Calendar, MapPin, Edit, Trash, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigationStore } from "@/lib/navigation-store";

const mockDrafts = [
	{
		id: "draft-1",
		name: "Concierto de Rock en el Zócalo",
		lastEdited: "2025-01-15T10:30:00Z",
		venue: "Zócalo CDMX",
		date: "2025-08-20",
	},
	{
		id: "draft-2",
		name: "Festival Gastronómico",
		lastEdited: "2025-01-14T16:45:00Z",
		venue: "Parque Chapultepec",
		date: "2025-09-05",
	},
	{
		id: "draft-3",
		name: "Teatro Musical - Hamilton",
		lastEdited: "2025-01-12T09:15:00Z",
		venue: "Teatro de la Ciudad",
		date: "2025-10-10",
	},
];

export function EventsDraftsView() {
	const { setView } = useNavigationStore();

	const formatRelativeTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 24) {
			return `Hace ${diffInHours}h`;
		}
		const diffInDays = Math.floor(diffInHours / 24);
		return `Hace ${diffInDays}d`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-MX", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Borradores</h1>
					<p className="text-muted-foreground">
						Eventos guardados sin publicar
					</p>
				</div>
				<Button onClick={() => setView("events-new")} className="gap-2">
					<Plus className="h-4 w-4" />
					Nuevo borrador
				</Button>
			</div>

			{mockDrafts.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<FileText className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="font-semibold text-lg mb-2">No tienes borradores</h3>
						<p className="text-muted-foreground text-center mb-4">
							Los eventos que guardes sin publicar aparecerán aquí
						</p>
						<Button onClick={() => setView("events-new")}>
							Crear primer borrador
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{mockDrafts.map((draft) => (
						<Card key={draft.id} className="hover:shadow-md transition-shadow">
							<CardHeader>
								<div className="flex items-start justify-between">
									<Badge variant="secondary" className="mb-2">
										Borrador
									</Badge>
									<span className="text-xs text-muted-foreground">
										{formatRelativeTime(draft.lastEdited)}
									</span>
								</div>
								<CardTitle className="line-clamp-2">{draft.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										<span>{draft.venue}</span>
									</div>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										<span>{formatDate(draft.date)}</span>
									</div>
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										className="flex-1 gap-2 bg-transparent"
										size="sm"
									>
										<Edit className="h-4 w-4" />
										Editar
									</Button>
									<Button variant="ghost" size="sm">
										<Trash className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
