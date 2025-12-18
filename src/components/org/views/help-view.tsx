"use client";

import {
	Book,
	MessageCircle,
	Mail,
	Phone,
	FileText,
	Video,
	ExternalLink,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function HelpView() {
	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="min-w-0">
				<h1 className="text-xl md:text-2xl font-bold tracking-tight">
					Centro de ayuda
				</h1>
				<p className="text-muted-foreground text-sm">
					Encuentra respuestas y soporte
				</p>
			</div>

			<div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<Book className="h-8 w-8 text-primary mb-2" />
						<CardTitle className="text-base">Documentación</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Guías completas y referencias de la plataforma
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<Video className="h-8 w-8 text-primary mb-2" />
						<CardTitle className="text-base">Tutoriales</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Videos paso a paso para comenzar
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<MessageCircle className="h-8 w-8 text-primary mb-2" />
						<CardTitle className="text-base">Chat en vivo</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Habla con nuestro equipo de soporte
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<FileText className="h-8 w-8 text-primary mb-2" />
						<CardTitle className="text-base">API Docs</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Documentación técnica para desarrolladores
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Preguntas frecuentes</CardTitle>
							<CardDescription>
								Respuestas a las dudas más comunes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="item-1">
									<AccordionTrigger>
										¿Cómo creo un nuevo evento?
									</AccordionTrigger>
									<AccordionContent>
										Para crear un evento, ve a la sección de Eventos y haz clic
										en "Crear evento". Completa la información básica, configura
										los tipos de boletos y precios, y publica cuando estés
										listo.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2">
									<AccordionTrigger>¿Cuándo recibo mis pagos?</AccordionTrigger>
									<AccordionContent>
										Los pagos se procesan según tu configuración de frecuencia
										de retiros (semanal, quincenal o mensual). Puedes ver tu
										calendario de pagos en la sección de Finanzas.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-3">
									<AccordionTrigger>
										¿Cuál es la comisión de la plataforma?
									</AccordionTrigger>
									<AccordionContent>
										La comisión varía según tu plan. Puedes revisar tu tasa
										específica en Configuración {">"} Facturación. Los planes
										Enterprise tienen comisiones más bajas.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-4">
									<AccordionTrigger>
										¿Cómo agrego miembros a mi equipo?
									</AccordionTrigger>
									<AccordionContent>
										Ve a la sección de Equipo y haz clic en "Invitar miembro".
										Ingresa el email y selecciona el rol apropiado. El nuevo
										miembro recibirá una invitación por correo.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-5">
									<AccordionTrigger>
										¿Puedo personalizar mi página de eventos?
									</AccordionTrigger>
									<AccordionContent>
										Sí, en Configuración {">"} Marca puedes personalizar
										colores, logo y dominio personalizado (disponible en planes
										Professional y Enterprise).
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recursos útiles</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{[
								{ title: "Guía de inicio rápido", icon: Book },
								{ title: "Mejores prácticas para ventas", icon: FileText },
								{ title: "Configurar pagos y facturación", icon: FileText },
								{ title: "Gestión de eventos masivos", icon: FileText },
								{ title: "Seguridad y prevención de fraude", icon: FileText },
							].map((resource, i) => (
								<div
									key={i}
									className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors gap-2"
								>
									<div className="flex items-center gap-3 min-w-0">
										<resource.icon className="h-5 w-5 text-muted-foreground shrink-0" />
										<span className="font-medium truncate">
											{resource.title}
										</span>
									</div>
									<ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageCircle className="h-5 w-5" />
								Contacta soporte
							</CardTitle>
							<CardDescription>Estamos aquí para ayudarte</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Button className="w-full gap-2">
								<MessageCircle className="h-4 w-4" />
								Iniciar chat en vivo
							</Button>

							<div className="space-y-3 pt-4 border-t">
								<div className="flex items-center gap-3 text-sm">
									<Mail className="h-4 w-4 text-muted-foreground shrink-0" />
									<div className="min-w-0">
										<p className="font-medium">Email</p>
										<p className="text-muted-foreground truncate">
											soporte@boletrics.mx
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3 text-sm">
									<Phone className="h-4 w-4 text-muted-foreground shrink-0" />
									<div className="min-w-0">
										<p className="font-medium">Teléfono</p>
										<p className="text-muted-foreground">+52 55 1234 5678</p>
									</div>
								</div>

								<div className="flex items-center gap-3 text-sm">
									<MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
									<div className="min-w-0">
										<p className="font-medium">WhatsApp</p>
										<p className="text-muted-foreground">+52 55 9876 5432</p>
									</div>
								</div>
							</div>

							<div className="pt-4 border-t">
								<p className="text-xs text-muted-foreground mb-2">
									Horario de atención:
								</p>
								<p className="text-sm font-medium">
									Lun - Vie: 9:00 AM - 7:00 PM
								</p>
								<p className="text-sm font-medium">Sáb: 10:00 AM - 2:00 PM</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Estado del sistema</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm">Plataforma</span>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm text-green-600">Operacional</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Pagos</span>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm text-green-600">Operacional</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">API</span>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm text-green-600">Operacional</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
