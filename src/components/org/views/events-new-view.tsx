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

export function EventsNewView() {
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async (draft = false) => {
		setIsSaving(true);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsSaving(false);
		router.push("/events");
	};

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
						onClick={() => handleSave(true)}
						disabled={isSaving}
					>
						Guardar borrador
					</Button>
					<Button
						onClick={() => handleSave(false)}
						disabled={isSaving}
						className="gap-2"
					>
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
								<Input id="name" placeholder="Festival de Música 2025" />
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="category">Categoría *</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="concert">Concierto</SelectItem>
											<SelectItem value="festival">Festival</SelectItem>
											<SelectItem value="theater">Teatro</SelectItem>
											<SelectItem value="sports">Deportes</SelectItem>
											<SelectItem value="conference">Conferencia</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="genre">Género</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="rock">Rock</SelectItem>
											<SelectItem value="pop">Pop</SelectItem>
											<SelectItem value="electronic">Electrónica</SelectItem>
											<SelectItem value="latin">Latina</SelectItem>
											<SelectItem value="reggaeton">Reggaetón</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Descripción</Label>
								<Textarea
									id="description"
									rows={4}
									placeholder="Describe tu evento..."
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
								<Input id="venue" placeholder="Foro Sol" />
							</div>

							<div className="grid gap-4 sm:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="city">Ciudad *</Label>
									<Input id="city" placeholder="Ciudad de México" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="state">Estado *</Label>
									<Input id="state" placeholder="CDMX" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="capacity">Capacidad *</Label>
									<Input id="capacity" type="number" placeholder="5000" />
								</div>
							</div>

							<Separator />

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="date">Fecha del evento *</Label>
									<Input id="date" type="date" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="time">Hora de inicio *</Label>
									<Input id="time" type="time" />
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="doors">Apertura de puertas</Label>
									<Input id="doors" type="time" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="end">Hora de finalización</Label>
									<Input id="end" type="time" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Ticket className="h-5 w-5" />
								Boletos
							</CardTitle>
							<CardDescription>
								Define los tipos de boletos y precios
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="p-4 rounded-lg border bg-muted/50">
								<p className="text-sm text-muted-foreground">
									Los tipos de boletos se configurarán después de crear el
									evento
								</p>
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
							<div className="aspect-video rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center">
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
								<Switch defaultChecked />
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Venta de boletos</Label>
									<p className="text-sm text-muted-foreground">
										Permitir compras
									</p>
								</div>
								<Switch defaultChecked />
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Múltiples fechas</Label>
									<p className="text-sm text-muted-foreground">
										Evento con varias fechas
									</p>
								</div>
								<Switch />
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
