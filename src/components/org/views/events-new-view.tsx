"use client";

import { useState } from "react";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	Ticket,
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
import { useRouter } from "next/navigation";
import { useCreateEvent } from "@/lib/api/hooks/use-events";
import { useVenues, useCreateVenue } from "@/lib/api/hooks/use-venues";
import { useOrgStore } from "@/lib/org-store";
import type { EventCategory, CreateEventInput } from "@/lib/api/types";
import { toast } from "sonner";

interface TicketTypeForm {
	id: string;
	name: string;
	price: number;
	quantity: number;
	description: string;
}

export function EventsNewView() {
	const router = useRouter();
	const { currentOrg } = useOrgStore();
	const { createEvent, isMutating } = useCreateEvent();
	const { data: venuesResult } = useVenues();
	const { createVenue } = useCreateVenue();

	const venues = venuesResult?.data ?? [];

	// Form state
	const [formData, setFormData] = useState({
		title: "",
		category: "" as EventCategory | "",
		description: "",
		artist: "",
		image_url: "",
		venue_id: "",
		date: "",
		start_time: "",
		end_time: "",
		isPublic: true,
		allowSales: true,
	});

	// New venue form (for when venue doesn't exist)
	const [showNewVenue, setShowNewVenue] = useState(false);
	const [newVenue, setNewVenue] = useState({
		name: "",
		address: "",
		city: "",
		state: "",
		region: "mexico-city" as const,
		capacity: 0,
	});

	// Ticket types (to be created after event)
	const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([
		{ id: "1", name: "General", price: 500, quantity: 100, description: "" },
	]);

	const handleSave = async (publish = false) => {
		if (!currentOrg) {
			toast.error("No hay organización seleccionada");
			return;
		}

		if (!formData.title || !formData.category || !formData.venue_id) {
			toast.error("Por favor completa los campos obligatorios");
			return;
		}

		try {
			// Create the event
			const eventInput: CreateEventInput = {
				organization_id: currentOrg.id,
				venue_id: formData.venue_id,
				title: formData.title,
				category: formData.category as EventCategory,
				description: formData.description || undefined,
				artist: formData.artist || undefined,
				image_url: formData.image_url || undefined,
				status: publish ? "published" : "draft",
			};

			const event = await createEvent(eventInput);

			toast.success(
				publish ? "Evento publicado exitosamente" : "Borrador guardado",
			);
			router.push(`/events/${event.id}`);
		} catch (error) {
			toast.error("Error al crear el evento");
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
				region: newVenue.region,
				capacity: newVenue.capacity || undefined,
			});

			setFormData({ ...formData, venue_id: venue.id });
			setShowNewVenue(false);
			toast.success("Lugar creado exitosamente");
		} catch (error) {
			toast.error("Error al crear el lugar");
		}
	};

	const addTicketType = () => {
		setTicketTypes([
			...ticketTypes,
			{
				id: Date.now().toString(),
				name: "",
				price: 0,
				quantity: 0,
				description: "",
			},
		]);
	};

	const removeTicketType = (id: string) => {
		if (ticketTypes.length > 1) {
			setTicketTypes(ticketTypes.filter((t) => t.id !== id));
		}
	};

	const updateTicketType = (
		id: string,
		field: keyof TicketTypeForm,
		value: string | number,
	) => {
		setTicketTypes(
			ticketTypes.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
		);
	};

	if (!currentOrg) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">
					Selecciona una organización para crear eventos
				</p>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/events">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Crear nuevo evento
					</h1>
					<p className="text-muted-foreground">
						Configura los detalles de tu evento
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => handleSave(false)}
						disabled={isMutating}
					>
						{isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Guardar borrador
					</Button>
					<Button
						onClick={() => handleSave(true)}
						disabled={isMutating}
						className="gap-2"
					>
						{isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						<Save className="h-4 w-4" />
						Publicar evento
					</Button>
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
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label>Región</Label>
											<Select
												value={newVenue.region}
												onValueChange={(value: typeof newVenue.region) =>
													setNewVenue({ ...newVenue, region: value })
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="mexico-city">
														Ciudad de México
													</SelectItem>
													<SelectItem value="monterrey">Monterrey</SelectItem>
													<SelectItem value="guadalajara">
														Guadalajara
													</SelectItem>
													<SelectItem value="cancun">Cancún</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label>Capacidad</Label>
											<Input
												type="number"
												placeholder="5000"
												value={newVenue.capacity || ""}
												onChange={(e) =>
													setNewVenue({
														...newVenue,
														capacity: parseInt(e.target.value) || 0,
													})
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

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="date">Fecha del evento *</Label>
									<Input
										id="date"
										type="date"
										value={formData.date}
										onChange={(e) =>
											setFormData({ ...formData, date: e.target.value })
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="time">Hora de inicio *</Label>
									<Input
										id="time"
										type="time"
										value={formData.start_time}
										onChange={(e) =>
											setFormData({ ...formData, start_time: e.target.value })
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="end">Hora de finalización</Label>
								<Input
									id="end"
									type="time"
									value={formData.end_time}
									onChange={(e) =>
										setFormData({ ...formData, end_time: e.target.value })
									}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Ticket className="h-5 w-5" />
								Tipos de boletos
							</CardTitle>
							<CardDescription>
								Define los tipos de boletos y precios (se crearán después de
								guardar el evento)
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{ticketTypes.map((ticket, index) => (
								<div
									key={ticket.id}
									className="p-4 border rounded-lg space-y-4"
								>
									<div className="flex items-center justify-between">
										<p className="font-medium text-sm">
											Tipo de boleto {index + 1}
										</p>
										{ticketTypes.length > 1 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeTicketType(ticket.id)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										)}
									</div>
									<div className="grid gap-4 sm:grid-cols-3">
										<div className="space-y-2">
											<Label>Nombre</Label>
											<Input
												placeholder="VIP, General, etc."
												value={ticket.name}
												onChange={(e) =>
													updateTicketType(ticket.id, "name", e.target.value)
												}
											/>
										</div>
										<div className="space-y-2">
											<Label>Precio (MXN)</Label>
											<Input
												type="number"
												placeholder="500"
												value={ticket.price || ""}
												onChange={(e) =>
													updateTicketType(
														ticket.id,
														"price",
														parseInt(e.target.value) || 0,
													)
												}
											/>
										</div>
										<div className="space-y-2">
											<Label>Cantidad</Label>
											<Input
												type="number"
												placeholder="100"
												value={ticket.quantity || ""}
												onChange={(e) =>
													updateTicketType(
														ticket.id,
														"quantity",
														parseInt(e.target.value) || 0,
													)
												}
											/>
										</div>
									</div>
								</div>
							))}
							<Button
								variant="outline"
								type="button"
								onClick={addTicketType}
								className="w-full"
							>
								<Plus className="h-4 w-4 mr-2" />
								Agregar tipo de boleto
							</Button>
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
							<div className="aspect-video rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
								<div className="text-center space-y-2">
									<ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										Arrastra una imagen o haz clic para seleccionar
									</p>
									<p className="text-xs text-muted-foreground">
										Tamaño recomendado: 1920x1080px
									</p>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="image_url">O ingresa una URL</Label>
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
