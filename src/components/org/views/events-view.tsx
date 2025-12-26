"use client";

import { useState } from "react";
import {
	Calendar,
	MapPin,
	Users,
	Plus,
	Search,
	MoreHorizontal,
	Edit,
	Copy,
	Trash,
	Loader2,
	Eye,
	Play,
	XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useOrganizationEvents } from "@/lib/api/hooks/use-events";
import { apiFetch } from "@/lib/api/client";
import { useOrgStore } from "@/lib/org-store";
import type { Event } from "@/lib/api/types";
import { toast } from "sonner";

export function EventsView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

	const { currentOrg } = useOrgStore();
	const {
		data: events = [],
		isLoading,
		error,
		mutate,
	} = useOrganizationEvents({
		include: "venue,dates,ticket_types",
	});

	// Count events by status
	const statusCounts = {
		all: events.length,
		draft: events.filter((e) => e.status === "draft").length,
		published: events.filter((e) => e.status === "published").length,
		cancelled: events.filter((e) => e.status === "cancelled").length,
		completed: events.filter((e) => e.status === "completed").length,
	};

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.venue?.name?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || event.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-MX", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const getStatusBadge = (status: Event["status"]) => {
		const variants: Record<
			Event["status"],
			{
				variant: "default" | "secondary" | "destructive" | "outline";
				label: string;
			}
		> = {
			draft: { variant: "secondary", label: "Borrador" },
			published: { variant: "default", label: "Publicado" },
			cancelled: { variant: "destructive", label: "Cancelado" },
			completed: { variant: "outline", label: "Finalizado" },
		};
		return variants[status] || { variant: "secondary", label: status };
	};

	const calculateTotalSold = (event: Event) => {
		return (
			event.ticket_types?.reduce((acc, tt) => acc + tt.quantity_sold, 0) ?? 0
		);
	};

	const calculateTotalCapacity = (event: Event) => {
		return (
			event.ticket_types?.reduce((acc, tt) => acc + tt.quantity_total, 0) ?? 0
		);
	};

	const calculateRevenue = (event: Event) => {
		return (
			event.ticket_types?.reduce(
				(acc, tt) => acc + tt.quantity_sold * tt.price,
				0,
			) ?? 0
		);
	};

	const handlePublish = async (eventId: string) => {
		try {
			await apiFetch(`/events/${eventId}`, {
				method: "PUT",
				body: {
					status: "published",
					published_at: new Date().toISOString(),
				},
			});
			mutate();
			toast.success("Evento publicado exitosamente");
		} catch {
			toast.error("Error al publicar el evento");
		}
	};

	const handleCancel = async (eventId: string) => {
		try {
			await apiFetch(`/events/${eventId}`, {
				method: "PUT",
				body: { status: "cancelled" },
			});
			mutate();
			toast.success("Evento cancelado");
		} catch {
			toast.error("Error al cancelar el evento");
		}
	};

	const handleDelete = async () => {
		if (!deleteEventId) return;
		try {
			await apiFetch(`/events/${deleteEventId}`, { method: "DELETE" });
			mutate();
			toast.success("Evento eliminado");
			setDeleteEventId(null);
		} catch {
			toast.error("Error al eliminar el evento");
		}
	};

	if (!currentOrg) {
		return (
			<div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">
					Selecciona una organización para ver los eventos
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="min-w-0">
					<h1 className="text-xl md:text-2xl font-bold tracking-tight">
						Eventos
					</h1>
					<p className="text-muted-foreground text-sm">
						Administra todos tus eventos y ventas
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link href="/events/new">
						<Plus className="h-4 w-4" />
						Crear evento
					</Link>
				</Button>
			</div>

			<div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
				<Tabs defaultValue="all" onValueChange={setStatusFilter}>
					<TabsList className="w-max">
						<TabsTrigger value="all">Todos ({statusCounts.all})</TabsTrigger>
						<TabsTrigger value="published">
							Publicados ({statusCounts.published})
						</TabsTrigger>
						<TabsTrigger value="draft">
							Borradores ({statusCounts.draft})
						</TabsTrigger>
						<TabsTrigger value="completed">
							Finalizados ({statusCounts.completed})
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<Card className="overflow-hidden">
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar eventos..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los estados</SelectItem>
								<SelectItem value="published">Publicados</SelectItem>
								<SelectItem value="draft">Borradores</SelectItem>
								<SelectItem value="completed">Finalizados</SelectItem>
								<SelectItem value="cancelled">Cancelados</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-destructive">Error al cargar eventos</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => mutate()}
							>
								Reintentar
							</Button>
						</div>
					) : filteredEvents.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground mb-4">
								{events.length === 0
									? "No hay eventos aún. ¡Crea tu primer evento!"
									: "No se encontraron eventos con los filtros aplicados"}
							</p>
							{events.length === 0 && (
								<Button asChild>
									<Link href="/events/new">
										<Plus className="h-4 w-4 mr-2" />
										Crear evento
									</Link>
								</Button>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<div className="rounded-md border min-w-[800px]">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Evento</TableHead>
											<TableHead>Fecha</TableHead>
											<TableHead>Ubicación</TableHead>
											<TableHead>Vendidos</TableHead>
											<TableHead>Ingresos</TableHead>
											<TableHead>Estado</TableHead>
											<TableHead className="w-[50px]"></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredEvents.map((event) => {
											const sold = calculateTotalSold(event);
											const capacity = calculateTotalCapacity(event);
											const revenue = calculateRevenue(event);
											const statusBadge = getStatusBadge(event.status);

											return (
												<TableRow key={event.id}>
													<TableCell className="font-medium max-w-[200px] truncate">
														<Link
															href={`/events/${event.id}`}
															className="hover:text-primary transition-colors"
														>
															{event.title}
														</Link>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
															<Calendar className="h-4 w-4 shrink-0" />
															{event.dates?.[0]
																? formatDate(event.dates[0].date)
																: "Sin fecha"}
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2 text-muted-foreground">
															<MapPin className="h-4 w-4 shrink-0" />
															<span className="truncate max-w-[150px]">
																{event.venue?.name ?? "Sin sede"}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2 whitespace-nowrap">
															<Users className="h-4 w-4 text-muted-foreground shrink-0" />
															<span>
																{sold.toLocaleString()} /{" "}
																{capacity.toLocaleString()}
															</span>
															{capacity > 0 && (
																<span className="text-xs text-muted-foreground">
																	({Math.round((sold / capacity) * 100)}%)
																</span>
															)}
														</div>
													</TableCell>
													<TableCell className="font-semibold whitespace-nowrap">
														{formatCurrency(revenue)}
													</TableCell>
													<TableCell>
														<Badge variant={statusBadge.variant}>
															{statusBadge.label}
														</Badge>
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8"
																>
																	<MoreHorizontal className="h-4 w-4" />
																	<span className="sr-only">Acciones</span>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Acciones</DropdownMenuLabel>
																<DropdownMenuSeparator />
																<DropdownMenuItem asChild>
																	<Link href={`/events/${event.id}`}>
																		<Eye className="mr-2 h-4 w-4" />
																		Ver detalles
																	</Link>
																</DropdownMenuItem>
																<DropdownMenuItem asChild>
																	<Link href={`/events/${event.id}/edit`}>
																		<Edit className="mr-2 h-4 w-4" />
																		Editar evento
																	</Link>
																</DropdownMenuItem>
																{event.status === "draft" && (
																	<DropdownMenuItem
																		onClick={() => handlePublish(event.id)}
																	>
																		<Play className="mr-2 h-4 w-4" />
																		Publicar
																	</DropdownMenuItem>
																)}
																{event.status === "published" && (
																	<DropdownMenuItem
																		onClick={() => handleCancel(event.id)}
																	>
																		<XCircle className="mr-2 h-4 w-4" />
																		Cancelar evento
																	</DropdownMenuItem>
																)}
																<DropdownMenuItem asChild>
																	<Link
																		href={`/events/new?duplicate=${event.id}`}
																	>
																		<Copy className="mr-2 h-4 w-4" />
																		Duplicar evento
																	</Link>
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	className="text-destructive"
																	onClick={() => setDeleteEventId(event.id)}
																>
																	<Trash className="mr-2 h-4 w-4" />
																	Eliminar evento
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deleteEventId}
				onOpenChange={() => setDeleteEventId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El evento y todos sus datos
							serán eliminados permanentemente.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
