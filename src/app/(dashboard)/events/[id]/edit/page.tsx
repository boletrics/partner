"use client";

import { useState, useEffect } from "react";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	ImageIcon,
	Save,
	Eye,
	Plus,
	Trash2,
	Loader2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
	useEvent,
	useUpdateEvent,
	useEventDates,
	useAddEventDate,
} from "@/lib/api/hooks/use-events";
import { apiFetch, revalidate } from "@/lib/api/client";
import { useVenues, useCreateVenue } from "@/lib/api/hooks/use-venues";
import type { EventCategory } from "@/lib/api/types";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface EventDateForm {
	id: string;
	date: string;
	start_time: string;
	end_time: string;
	isNew?: boolean;
}

export default function EditEventPage() {
	const router = useRouter();
	const params = useParams();
	const eventId = params.id as string;

	const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
	const { updateEvent, isMutating } = useUpdateEvent(eventId);
	const { data: venues = [] } = useVenues();
	const { createVenue } = useCreateVenue();
	const { data: existingDates = [] } = useEventDates(eventId);
	const { addDate } = useAddEventDate(eventId);

	// Form state
	const [formData, setFormData] = useState({
		title: "",
		category: "" as EventCategory | "",
		description: "",
		artist: "",
		image_url: "",
		image_blur: "",
		venue_id: "",
		isPublic: true,
		allowSales: true,
	});

	// Event dates (1:n relationship)
	const [eventDates, setEventDates] = useState<EventDateForm[]>([]);

	// New venue form
	const [showNewVenue, setShowNewVenue] = useState(false);
	const [newVenue, setNewVenue] = useState({
		name: "",
		address: "",
		city: "",
		state: "",
		region: "mexico-city" as const,
		capacity: 0,
	});

	// Load event data into form
	useEffect(() => {
		if (event) {
			setFormData({
				title: event.title,
				category: event.category,
				description: event.description ?? "",
				artist: event.artist ?? "",
				image_url: event.image_url ?? "",
				image_blur: event.image_blur ?? "",
				venue_id: event.venue_id,
				isPublic: true,
				allowSales: true,
			});
		}
	}, [event]);

	// Load existing dates
	useEffect(() => {
		if (existingDates.length > 0) {
			setEventDates(
				existingDates.map((d) => ({
					id: d.id,
					date: d.date,
					start_time: d.start_time,
					end_time: d.end_time ?? "",
					isNew: false,
				})),
			);
		} else if (event?.dates && event.dates.length > 0) {
			setEventDates(
				event.dates.map((d) => ({
					id: d.id,
					date: d.date,
					start_time: d.start_time,
					end_time: d.end_time ?? "",
					isNew: false,
				})),
			);
		}
	}, [existingDates, event?.dates]);

	const handleSave = async (publish = false) => {
		if (!formData.title || !formData.category || !formData.venue_id) {
			toast.error("Por favor completa los campos obligatorios");
			return;
		}

		try {
			// Update the event
			await updateEvent({
				venue_id: formData.venue_id,
				title: formData.title,
				category: formData.category as EventCategory,
				description: formData.description || undefined,
				artist: formData.artist || undefined,
				image_url: formData.image_url || undefined,
				image_blur: formData.image_blur || undefined,
				status: publish ? "published" : event?.status,
				published_at: publish ? new Date().toISOString() : undefined,
			});

			// Add new dates
			const newDates = eventDates.filter(
				(d) => d.isNew && d.date && d.start_time,
			);
			for (const newDate of newDates) {
				try {
					await addDate({
						date: newDate.date,
						start_time: newDate.start_time,
						end_time: newDate.end_time || undefined,
					});
				} catch (err) {
					console.error("Error adding date:", err);
				}
			}

			toast.success(
				publish ? "Evento publicado exitosamente" : "Cambios guardados",
			);
			router.push(`/events/${eventId}`);
		} catch (error) {
			toast.error("Error al actualizar el evento");
			console.error(error);
		}
	};

	const handleCreateVenue = async () => {
		if (
			!newVenue.name ||
			!newVenue.address ||
			!newVenue.city ||
			!newVenue.state
		) {
			toast.error("Por favor completa los campos del lugar");
			return;
		}

		try {
			const venue = await createVenue({
				name: newVenue.name,
				address: newVenue.address,
				city: newVenue.city,
				state: newVenue.state,
				country: "México",
				region: newVenue.region,
				capacity: newVenue.capacity || undefined,
			});

			setFormData({ ...formData, venue_id: venue.id });
			setShowNewVenue(false);
			toast.success("Lugar creado exitosamente");
		} catch {
			toast.error("Error al crear el lugar");
		}
	};

	const addEventDate = () => {
		setEventDates([
			...eventDates,
			{
				id: Date.now().toString(),
				date: "",
				start_time: "",
				end_time: "",
				isNew: true,
			},
		]);
	};

	const removeEventDate = async (id: string, isNew?: boolean) => {
		if (eventDates.length > 1) {
			if (!isNew) {
				// Remove from server
				try {
					await apiFetch(`/event-dates/${id}`, { method: "DELETE" });
					revalidate(`/events/${eventId}`);
					revalidate(/\/event-dates/);
					toast.success("Fecha eliminada");
				} catch {
					toast.error("Error al eliminar la fecha");
					return;
				}
			}
			setEventDates(eventDates.filter((d) => d.id !== id));
		}
	};

	const updateEventDate = (
		id: string,
		field: keyof EventDateForm,
		value: string,
	) => {
		setEventDates(
			eventDates.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
		);
	};

	if (isLoadingEvent) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!event) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold">Evento no encontrado</h1>
				<Button asChild className="mt-4">
					<Link href="/events">Volver a eventos</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href={`/events/${eventId}`}>
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold tracking-tight">Editar evento</h1>
					<p className="text-muted-foreground">
						Modifica los detalles del evento
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => handleSave(false)}
						disabled={isMutating}
					>
						{isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Guardar cambios
					</Button>
					{event.status === "draft" && (
						<Button
							onClick={() => handleSave(true)}
							disabled={isMutating}
							className="gap-2"
						>
							{isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							<Save className="h-4 w-4" />
							Publicar evento
						</Button>
					)}
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Información básica
							</CardTitle>
							<CardDescription>Detalles principales del evento</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre del evento *</Label>
								<Input
									id="name"
									placeholder="Festival de Música 2025"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
								/>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="category">Categoría *</Label>
									<Select
										value={formData.category}
										onValueChange={(value) =>
											setFormData({
												...formData,
												category: value as EventCategory,
											})
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="concert">Concierto</SelectItem>
											<SelectItem value="festival">Festival</SelectItem>
											<SelectItem value="theater">Teatro</SelectItem>
											<SelectItem value="sports">Deportes</SelectItem>
											<SelectItem value="comedy">Comedia</SelectItem>
											<SelectItem value="conference">Conferencia</SelectItem>
											<SelectItem value="exhibition">Exposición</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="artist">Artista / Presentador</Label>
									<Input
										id="artist"
										placeholder="Nombre del artista"
										value={formData.artist}
										onChange={(e) =>
											setFormData({ ...formData, artist: e.target.value })
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Descripción</Label>
								<Textarea
									id="description"
									rows={4}
									placeholder="Describe tu evento..."
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="h-5 w-5" />
								Ubicación y fecha
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="venue">Lugar *</Label>
								<div className="flex gap-2">
									<Select
										value={formData.venue_id}
										onValueChange={(value) =>
											setFormData({ ...formData, venue_id: value })
										}
									>
										<SelectTrigger className="flex-1">
											<SelectValue placeholder="Seleccionar lugar" />
										</SelectTrigger>
										<SelectContent>
											{venues.map((venue) => (
												<SelectItem key={venue.id} value={venue.id}>
													{venue.name} - {venue.city}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										type="button"
										onClick={() => setShowNewVenue(!showNewVenue)}
									>
										<Plus className="h-4 w-4 mr-1" />
										Nuevo
									</Button>
								</div>
							</div>

							{showNewVenue && (
								<div className="p-4 border rounded-lg space-y-4 bg-muted/50">
									<p className="font-medium text-sm">Crear nuevo lugar</p>
									<div className="space-y-2">
										<Label>Nombre del lugar</Label>
										<Input
											placeholder="Foro Sol"
											value={newVenue.name}
											onChange={(e) =>
												setNewVenue({ ...newVenue, name: e.target.value })
											}
										/>
									</div>
									<div className="space-y-2">
										<Label>Dirección</Label>
										<Input
											placeholder="Av. Río Churubusco s/n"
											value={newVenue.address}
											onChange={(e) =>
												setNewVenue({ ...newVenue, address: e.target.value })
											}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label>Ciudad</Label>
											<Input
												placeholder="Ciudad de México"
												value={newVenue.city}
												onChange={(e) =>
													setNewVenue({ ...newVenue, city: e.target.value })
												}
											/>
										</div>
										<div className="space-y-2">
											<Label>Estado</Label>
											<Input
												placeholder="CDMX"
												value={newVenue.state}
												onChange={(e) =>
													setNewVenue({ ...newVenue, state: e.target.value })
												}
											/>
										</div>
									</div>
									<Button type="button" onClick={handleCreateVenue}>
										Crear lugar
									</Button>
								</div>
							)}

							<Separator />

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Fechas del evento</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addEventDate}
									>
										<Plus className="h-4 w-4 mr-1" />
										Agregar fecha
									</Button>
								</div>

								{eventDates.map((eventDate, index) => (
									<div
										key={eventDate.id}
										className="p-4 border rounded-lg space-y-4 bg-muted/30"
									>
										<div className="flex items-center justify-between">
											<p className="font-medium text-sm">
												Fecha {index + 1}
												{eventDate.isNew && (
													<span className="ml-2 text-xs text-muted-foreground">
														(nueva)
													</span>
												)}
											</p>
											{eventDates.length > 1 && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														removeEventDate(eventDate.id, eventDate.isNew)
													}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											)}
										</div>
										<div className="grid gap-4 sm:grid-cols-3">
											<div className="space-y-2">
												<Label>Fecha *</Label>
												<Input
													type="date"
													value={eventDate.date}
													onChange={(e) =>
														updateEventDate(
															eventDate.id,
															"date",
															e.target.value,
														)
													}
												/>
											</div>
											<div className="space-y-2">
												<Label>Hora de inicio *</Label>
												<Input
													type="time"
													value={eventDate.start_time}
													onChange={(e) =>
														updateEventDate(
															eventDate.id,
															"start_time",
															e.target.value,
														)
													}
												/>
											</div>
											<div className="space-y-2">
												<Label>Hora de fin</Label>
												<Input
													type="time"
													value={eventDate.end_time}
													onChange={(e) =>
														updateEventDate(
															eventDate.id,
															"end_time",
															e.target.value,
														)
													}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ImageIcon className="h-5 w-5" />
								Imagen del evento
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<ImageUpload
								value={formData.image_url}
								onChange={(value) =>
									setFormData({
										...formData,
										image_url: value?.url ?? "",
										image_blur: value?.blur ?? "",
									})
								}
								context="event"
								placeholder="Arrastra una imagen o haz clic para seleccionar"
								aspectRatio="16/9"
							/>
							<div className="space-y-2">
								<Label htmlFor="image_url">O ingresa una URL manualmente</Label>
								<Input
									id="image_url"
									placeholder="https://..."
									value={formData.image_url}
									onChange={(e) =>
										setFormData({ ...formData, image_url: e.target.value })
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Configuración</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Evento público</Label>
									<p className="text-sm text-muted-foreground">
										Visible en el catálogo
									</p>
								</div>
								<Switch
									checked={formData.isPublic}
									onCheckedChange={(checked) =>
										setFormData({ ...formData, isPublic: checked })
									}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Venta de boletos</Label>
									<p className="text-sm text-muted-foreground">
										Permitir compras
									</p>
								</div>
								<Switch
									checked={formData.allowSales}
									onCheckedChange={(checked) =>
										setFormData({ ...formData, allowSales: checked })
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Vista previa</CardTitle>
						</CardHeader>
						<CardContent>
							<Button variant="outline" className="w-full gap-2 bg-transparent">
								<Eye className="h-4 w-4" />
								Ver como cliente
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
