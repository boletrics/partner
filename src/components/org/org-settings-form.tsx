"use client";

import { useState } from "react";
import {
	Building2,
	Globe,
	CreditCard,
	Bell,
	Palette,
	Save,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useOrgStore } from "@/lib/org-store";

export function OrgSettingsForm() {
	const { currentOrg, updateOrganization } = useOrgStore();
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		setIsSaving(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSaving(false);
	};

	if (!currentOrg) return null;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
				<p className="text-muted-foreground">
					Administra la configuración de tu organización
				</p>
			</div>

			<Tabs defaultValue="general" className="space-y-6">
				<TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
					<TabsTrigger value="general" className="gap-2">
						<Building2 className="h-4 w-4" />
						<span className="hidden sm:inline">General</span>
					</TabsTrigger>
					<TabsTrigger value="billing" className="gap-2">
						<CreditCard className="h-4 w-4" />
						<span className="hidden sm:inline">Facturación</span>
					</TabsTrigger>
					<TabsTrigger value="notifications" className="gap-2">
						<Bell className="h-4 w-4" />
						<span className="hidden sm:inline">Notificaciones</span>
					</TabsTrigger>
					<TabsTrigger value="branding" className="gap-2">
						<Palette className="h-4 w-4" />
						<span className="hidden sm:inline">Marca</span>
					</TabsTrigger>
					<TabsTrigger value="integrations" className="gap-2">
						<Globe className="h-4 w-4" />
						<span className="hidden sm:inline">Integraciones</span>
					</TabsTrigger>
				</TabsList>

				{/* General Settings */}
				<TabsContent value="general">
					<Card>
						<CardHeader>
							<CardTitle>Información General</CardTitle>
							<CardDescription>
								Datos básicos de tu organización que aparecerán en tus eventos
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="name">Nombre de la organización</Label>
									<Input id="name" defaultValue={currentOrg.name} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="slug">URL personalizada</Label>
									<div className="flex">
										<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
											boletrics.mx/
										</span>
										<Input
											id="slug"
											defaultValue={currentOrg.slug}
											className="rounded-l-none"
										/>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Descripción</Label>
								<Textarea
									id="description"
									defaultValue={currentOrg.description}
									rows={3}
								/>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="email">Email de contacto</Label>
									<Input
										id="email"
										type="email"
										defaultValue={currentOrg.email}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Teléfono</Label>
									<Input id="phone" defaultValue={currentOrg.phone} />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="website">Sitio web</Label>
								<Input
									id="website"
									type="url"
									defaultValue={currentOrg.website}
								/>
							</div>

							<Separator />

							<div className="space-y-4">
								<h4 className="font-medium">Dirección fiscal</h4>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="street">Calle y número</Label>
										<Input
											id="street"
											defaultValue={currentOrg.address?.street}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="city">Ciudad</Label>
										<Input id="city" defaultValue={currentOrg.address?.city} />
									</div>
									<div className="space-y-2">
										<Label htmlFor="state">Estado</Label>
										<Input
											id="state"
											defaultValue={currentOrg.address?.state}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="postalCode">Código postal</Label>
										<Input
											id="postalCode"
											defaultValue={currentOrg.address?.postalCode}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="taxId">RFC</Label>
										<Input id="taxId" defaultValue={currentOrg.taxId} />
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<Button
									onClick={handleSave}
									disabled={isSaving}
									className="gap-2"
								>
									<Save className="h-4 w-4" />
									{isSaving ? "Guardando..." : "Guardar cambios"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Billing Settings */}
				<TabsContent value="billing">
					<Card>
						<CardHeader>
							<CardTitle>Configuración de Facturación</CardTitle>
							<CardDescription>
								Administra tu plan, comisiones y métodos de pago
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="p-4 rounded-lg border bg-muted/50">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium">Plan actual</p>
										<p className="text-2xl font-bold capitalize">
											{currentOrg.plan}
										</p>
									</div>
									<Button variant="outline">Cambiar plan</Button>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="currency">Moneda</Label>
									<Select defaultValue={currentOrg.settings.currency}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
											<SelectItem value="USD">Dólar Americano (USD)</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="payout">Frecuencia de pagos</Label>
									<Select defaultValue={currentOrg.settings.payoutSchedule}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="daily">Diario</SelectItem>
											<SelectItem value="weekly">Semanal</SelectItem>
											<SelectItem value="biweekly">Quincenal</SelectItem>
											<SelectItem value="monthly">Mensual</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="p-4 rounded-lg border">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium">Comisión de plataforma</p>
										<p className="text-sm text-muted-foreground">
											Porcentaje que cobra Boletrics por cada venta
										</p>
									</div>
									<p className="text-2xl font-bold">
										{currentOrg.settings.commissionRate}%
									</p>
								</div>
							</div>

							<div className="flex justify-end">
								<Button
									onClick={handleSave}
									disabled={isSaving}
									className="gap-2"
								>
									<Save className="h-4 w-4" />
									{isSaving ? "Guardando..." : "Guardar cambios"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notification Settings */}
				<TabsContent value="notifications">
					<Card>
						<CardHeader>
							<CardTitle>Preferencias de Notificaciones</CardTitle>
							<CardDescription>
								Configura cómo y cuándo recibir alertas
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Notificaciones por email</Label>
										<p className="text-sm text-muted-foreground">
											Recibe alertas de ventas y actividad por correo
										</p>
									</div>
									<Switch
										defaultChecked={
											currentOrg.settings.notificationPreferences.email
										}
									/>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Notificaciones SMS</Label>
										<p className="text-sm text-muted-foreground">
											Alertas urgentes por mensaje de texto
										</p>
									</div>
									<Switch
										defaultChecked={
											currentOrg.settings.notificationPreferences.sms
										}
									/>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Notificaciones push</Label>
										<p className="text-sm text-muted-foreground">
											Alertas en tiempo real en tu navegador
										</p>
									</div>
									<Switch
										defaultChecked={
											currentOrg.settings.notificationPreferences.push
										}
									/>
								</div>
							</div>

							<div className="flex justify-end">
								<Button
									onClick={handleSave}
									disabled={isSaving}
									className="gap-2"
								>
									<Save className="h-4 w-4" />
									{isSaving ? "Guardando..." : "Guardar cambios"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Branding Settings */}
				<TabsContent value="branding">
					<Card>
						<CardHeader>
							<CardTitle>Personalización de Marca</CardTitle>
							<CardDescription>
								Personaliza la apariencia de tus páginas de eventos
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="primaryColor">Color primario</Label>
									<div className="flex gap-2">
										<Input
											id="primaryColor"
											type="color"
											defaultValue={
												currentOrg.settings.branding.primaryColor || "#E31837"
											}
											className="w-12 h-10 p-1"
										/>
										<Input
											defaultValue={
												currentOrg.settings.branding.primaryColor || "#E31837"
											}
											className="flex-1"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="secondaryColor">Color secundario</Label>
									<div className="flex gap-2">
										<Input
											id="secondaryColor"
											type="color"
											defaultValue={
												currentOrg.settings.branding.secondaryColor || "#1E3A8A"
											}
											className="w-12 h-10 p-1"
										/>
										<Input
											defaultValue={
												currentOrg.settings.branding.secondaryColor || "#1E3A8A"
											}
											className="flex-1"
										/>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="customDomain">Dominio personalizado</Label>
								<Input
									id="customDomain"
									placeholder="eventos.tudominio.com"
									defaultValue={currentOrg.settings.branding.customDomain}
								/>
								<p className="text-sm text-muted-foreground">
									Disponible en el plan Enterprise
								</p>
							</div>

							<div className="flex justify-end">
								<Button
									onClick={handleSave}
									disabled={isSaving}
									className="gap-2"
								>
									<Save className="h-4 w-4" />
									{isSaving ? "Guardando..." : "Guardar cambios"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Integrations */}
				<TabsContent value="integrations">
					<Card>
						<CardHeader>
							<CardTitle>Integraciones</CardTitle>
							<CardDescription>
								Conecta servicios externos para potenciar tu gestión
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{[
								{
									name: "Stripe",
									description: "Procesamiento de pagos con tarjeta",
									connected: true,
								},
								{
									name: "OXXO Pay",
									description: "Pagos en efectivo en tiendas OXXO",
									connected: true,
								},
								{
									name: "Mercado Pago",
									description: "Pagos digitales y transferencias",
									connected: false,
								},
								{
									name: "Google Analytics",
									description: "Análisis de tráfico y conversiones",
									connected: false,
								},
								{
									name: "Mailchimp",
									description: "Marketing por email automatizado",
									connected: false,
								},
							].map((integration) => (
								<div
									key={integration.name}
									className="flex items-center justify-between p-4 rounded-lg border"
								>
									<div>
										<p className="font-medium">{integration.name}</p>
										<p className="text-sm text-muted-foreground">
											{integration.description}
										</p>
									</div>
									<Button
										variant={integration.connected ? "outline" : "default"}
									>
										{integration.connected ? "Configurar" : "Conectar"}
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
