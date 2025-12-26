"use client";

import { useState } from "react";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	Users,
	Ticket,
	Edit,
	Trash2,
	Play,
	XCircle,
	Loader2,
	ExternalLink,
	Plus,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	useEvent,
	useDeleteEvent,
	usePublishEvent,
	useCancelEvent,
	useEventDates,
	useAddEventDate,
} from "@/lib/api/hooks/use-events";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";

interface EventDetailViewProps {
	eventId: string;
}

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	draft: { label: "Borrador", variant: "secondary" },
	published: { label: "Publicado", variant: "default" },
	cancelled: { label: "Cancelado", variant: "destructive" },
	completed: { label: "Completado", variant: "outline" },
};

const categoryLabels: Record<string, string> = {
	concert: "Concierto",
	sports: "Deportes",
	theater: "Teatro",
	festival: "Festival",
	comedy: "Comedia",
	conference: "Conferencia",
	exhibition: "Exposición",
};

export function EventDetailView({ eventId }: EventDetailViewProps) {
	const router = useRouter();
	const { data: event, isLoading, error, mutate } = useEvent(eventId);
	const { data: eventDates, mutate: mutateDates } = useEventDates(eventId);
	const { deleteEvent } = useDeleteEvent(eventId);
	const { publishEvent } = usePublishEvent(eventId);
	const { cancelEvent } = useCancelEvent(eventId);
	const { addDate, isMutating: isAddingDate } = useAddEventDate(eventId);

	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showAddDateDialog, setShowAddDateDialog] = useState(false);
	const [showEditDateDialog, setShowEditDateDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [deletingDateId, setDeletingDateId] = useState<string | null>(null);
	const [isUpdatingDate, setIsUpdatingDate] = useState(false);

	// New date form state
	const [newDate, setNewDate] = useState({
		date: "",
		start_time: "",
		end_time: "",
	});

	// Edit date form state
	const [editingDate, setEditingDate] = useState<{
		id: string;
		date: string;
		start_time: string;
		end_time: string;
	} | null>(null);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteEvent();
			toast.success("Evento eliminado");
			router.push("/events");
		} catch {
			toast.error("Error al eliminar el evento");
		} finally {
			setIsDeleting(false);
			setShowDeleteDialog(false);
		}
	};

	const handlePublish = async () => {
		setIsPublishing(true);
		try {
			await publishEvent();
			mutate();
			toast.success("Evento publicado");
		} catch {
			toast.error("Error al publicar el evento");
		} finally {
			setIsPublishing(false);
		}
	};

	const handleCancel = async () => {
		setIsCancelling(true);
		try {
			await cancelEvent();
			mutate();
			toast.success("Evento cancelado");
		} catch {
			toast.error("Error al cancelar el evento");
		} finally {
			setIsCancelling(false);
		}
	};

	const handleAddDate = async () => {
		if (!newDate.date || !newDate.start_time) {
			toast.error("Por favor completa la fecha y hora de inicio");
			return;
		}

		try {
			await addDate({
				date: newDate.date,
				start_time: newDate.start_time,
				end_time: newDate.end_time || undefined,
			});
			mutateDates();
			mutate();
			setShowAddDateDialog(false);
			setNewDate({ date: "", start_time: "", end_time: "" });
			toast.success("Fecha agregada");
		} catch {
			toast.error("Error al agregar la fecha");
		}
	};

	const handleDeleteDate = async (dateId: string) => {
		setDeletingDateId(dateId);
		try {
			await apiFetch(`/event-dates/${dateId}`, { method: "DELETE" });
			mutateDates();
			mutate();
			toast.success("Fecha eliminada");
		} catch {
			toast.error("Error al eliminar la fecha");
		} finally {
			setDeletingDateId(null);
		}
	};

	const handleEditDate = (date: {
		id: string;
		date: string;
		start_time: string;
		end_time?: string | null;
	}) => {
		setEditingDate({
			id: date.id,
			date: date.date,
			start_time: date.start_time,
			end_time: date.end_time || "",
		});
		setShowEditDateDialog(true);
	};

	const handleUpdateDate = async () => {
		if (!editingDate || !editingDate.date || !editingDate.start_time) {
			toast.error("Por favor completa la fecha y hora de inicio");
			return;
		}

		setIsUpdatingDate(true);
		try {
			await apiFetch(`/event-dates/${editingDate.id}`, {
				method: "PUT",
				body: {
					event_id: eventId,
					date: editingDate.date,
					start_time: editingDate.start_time,
					end_time: editingDate.end_time || null,
				},
			});
			mutateDates();
			mutate();
			setShowEditDateDialog(false);
			setEditingDate(null);
			toast.success("Fecha actualizada");
		} catch {
			toast.error("Error al actualizar la fecha");
		} finally {
			setIsUpdatingDate(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/events">
							<ArrowLeft className="h-5 w-5" />
						</Link>
					</Button>
					<h1 className="text-2xl font-bold">Evento no encontrado</h1>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">
							El evento que buscas no existe o fue eliminado.
						</p>
						<Button asChild className="mt-4">
							<Link href="/events">Volver a eventos</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const status = statusConfig[event.status] ?? statusConfig.draft;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/events">
							<ArrowLeft className="h-5 w-5" />
						</Link>
					</Button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold">{event.title}</h1>
							<Badge variant={status.variant}>{status.label}</Badge>
						</div>
						<p className="text-muted-foreground">
							{categoryLabels[event.category] ?? event.category}
							{event.artist && ` • ${event.artist}`}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{event.status === "draft" && (
						<Button onClick={handlePublish} disabled={isPublishing}>
							{isPublishing ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Play className="h-4 w-4 mr-2" />
							)}
							Publicar
						</Button>
					)}
					{event.status === "published" && (
						<Button
							variant="destructive"
							onClick={handleCancel}
							disabled={isCancelling}
						>
							{isCancelling ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<XCircle className="h-4 w-4 mr-2" />
							)}
							Cancelar
						</Button>
					)}
					<Button variant="outline" asChild>
						<Link href={`/events/${eventId}/edit`}>
							<Edit className="h-4 w-4 mr-2" />
							Editar
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Event Image */}
					{event.image_url && (
						<Card>
							<CardContent className="p-0">
								<img
									src={event.image_url}
									alt={event.title}
									className="w-full h-64 object-cover rounded-lg"
								/>
							</CardContent>
						</Card>
					)}

					{/* Description */}
					<Card>
						<CardHeader>
							<CardTitle>Descripción</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground whitespace-pre-wrap">
								{event.description || "Sin descripción"}
							</p>
						</CardContent>
					</Card>

					{/* Ticket Types */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Ticket className="h-5 w-5" />
								Tipos de boletos
							</CardTitle>
							<CardDescription>
								Gestiona los tipos de boletos disponibles
							</CardDescription>
						</CardHeader>
						<CardContent>
							{event.ticket_types && event.ticket_types.length > 0 ? (
								<div className="space-y-3">
									{event.ticket_types.map((ticketType) => (
										<div
											key={ticketType.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div>
												<p className="font-medium">{ticketType.name}</p>
												{ticketType.description && (
													<p className="text-sm text-muted-foreground">
														{ticketType.description}
													</p>
												)}
											</div>
											<div className="text-right">
												<p className="font-semibold">
													${ticketType.price.toLocaleString("es-MX")}
												</p>
												<p className="text-sm text-muted-foreground">
													{ticketType.quantity_available} /{" "}
													{ticketType.quantity_total} disponibles
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground text-center py-4">
									No hay tipos de boletos configurados
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Venue */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="h-5 w-5" />
								Lugar
							</CardTitle>
						</CardHeader>
						<CardContent>
							{event.venue ? (
								<div className="space-y-1">
									<p className="font-medium">{event.venue.name}</p>
									<p className="text-sm text-muted-foreground">
										{event.venue.address}
									</p>
									<p className="text-sm text-muted-foreground">
										{event.venue.city}, {event.venue.state}
									</p>
									{event.venue.capacity && (
										<p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
											<Users className="h-4 w-4" />
											Capacidad: {event.venue.capacity.toLocaleString()}
										</p>
									)}
								</div>
							) : (
								<p className="text-muted-foreground">Sin lugar asignado</p>
							)}
						</CardContent>
					</Card>

					{/* Dates */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Fechas
								</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowAddDateDialog(true)}
								>
									<Plus className="h-4 w-4 mr-1" />
									Agregar
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{(eventDates ?? event.dates ?? []).length > 0 ? (
								<div className="space-y-2">
									{(eventDates ?? event.dates ?? []).map((date) => (
										<div
											key={date.id}
											className="p-2 border rounded-lg text-sm group"
										>
											<div className="flex items-start justify-between">
												<div>
													<p className="font-medium">
														{new Date(
															date.date + "T00:00:00",
														).toLocaleDateString("es-MX", {
															weekday: "long",
															year: "numeric",
															month: "long",
															day: "numeric",
														})}
													</p>
													<p className="text-muted-foreground">
														{date.start_time}
														{date.end_time && ` - ${date.end_time}`}
													</p>
												</div>
												<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleEditDate(date)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDeleteDate(date.id)}
														disabled={deletingDateId === date.id}
													>
														{deletingDateId === date.id ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4 text-destructive" />
														)}
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground text-center py-2">
									No hay fechas programadas
								</p>
							)}
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Acciones rápidas</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Button
								variant="outline"
								className="w-full justify-start"
								asChild
							>
								<Link href={`/events/${eventId}/orders`}>
									<Users className="h-4 w-4 mr-2" />
									Ver órdenes
								</Link>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								asChild
							>
								<Link href={`/scan?eventId=${eventId}`}>
									<Ticket className="h-4 w-4 mr-2" />
									Escanear boletos
								</Link>
							</Button>
							{event.status === "published" && (
								<Button
									variant="outline"
									className="w-full justify-start"
									asChild
								>
									<a
										href={`https://tickets-local.boletrics.workers.dev/events/${event.slug}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4 mr-2" />
										Ver en tickets
									</a>
								</Button>
							)}
						</CardContent>
					</Card>

					{/* Metadata */}
					<Card>
						<CardContent className="pt-6">
							<dl className="space-y-2 text-sm">
								<div className="flex justify-between">
									<dt className="text-muted-foreground">ID</dt>
									<dd className="font-mono text-xs">
										{event.id.slice(0, 8)}...
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Slug</dt>
									<dd className="font-mono text-xs">{event.slug}</dd>
								</div>
								<Separator />
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Creado</dt>
									<dd>
										{new Date(event.created_at).toLocaleDateString("es-MX")}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Actualizado</dt>
									<dd>
										{new Date(event.updated_at).toLocaleDateString("es-MX")}
									</dd>
								</div>
							</dl>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. Se eliminarán todos los datos
							asociados al evento, incluyendo boletos y órdenes.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : null}
							Eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Add Date Dialog */}
			<Dialog open={showAddDateDialog} onOpenChange={setShowAddDateDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Agregar fecha</DialogTitle>
						<DialogDescription>
							Agrega una nueva fecha para este evento.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="new-date">Fecha *</Label>
							<Input
								id="new-date"
								type="date"
								value={newDate.date}
								onChange={(e) =>
									setNewDate({ ...newDate, date: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-4 grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="new-start-time">Hora de inicio *</Label>
								<Input
									id="new-start-time"
									type="time"
									value={newDate.start_time}
									onChange={(e) =>
										setNewDate({ ...newDate, start_time: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="new-end-time">Hora de fin</Label>
								<Input
									id="new-end-time"
									type="time"
									value={newDate.end_time}
									onChange={(e) =>
										setNewDate({ ...newDate, end_time: e.target.value })
									}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowAddDateDialog(false)}
						>
							Cancelar
						</Button>
						<Button onClick={handleAddDate} disabled={isAddingDate}>
							{isAddingDate && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Agregar fecha
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Date Dialog */}
			<Dialog
				open={showEditDateDialog}
				onOpenChange={(open) => {
					setShowEditDateDialog(open);
					if (!open) setEditingDate(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar fecha</DialogTitle>
						<DialogDescription>
							Modifica la fecha y horarios del evento.
						</DialogDescription>
					</DialogHeader>
					{editingDate && (
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="edit-date">Fecha *</Label>
								<Input
									id="edit-date"
									type="date"
									value={editingDate.date}
									onChange={(e) =>
										setEditingDate({ ...editingDate, date: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-4 grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="edit-start-time">Hora de inicio *</Label>
									<Input
										id="edit-start-time"
										type="time"
										value={editingDate.start_time}
										onChange={(e) =>
											setEditingDate({
												...editingDate,
												start_time: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="edit-end-time">Hora de fin</Label>
									<Input
										id="edit-end-time"
										type="time"
										value={editingDate.end_time}
										onChange={(e) =>
											setEditingDate({
												...editingDate,
												end_time: e.target.value,
											})
										}
									/>
								</div>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setShowEditDateDialog(false);
								setEditingDate(null);
							}}
						>
							Cancelar
						</Button>
						<Button onClick={handleUpdateDate} disabled={isUpdatingDate}>
							{isUpdatingDate && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Guardar cambios
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
