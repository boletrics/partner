"use client";

import Link from "next/link";
import { Bell, Search, Ticket } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useOrgStore } from "@/lib/org-store";

export function OrgHeader() {
	const { currentOrg } = useOrgStore();

	return (
		<header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />

			{/* Logo link to public site */}
			<Link href="/" className="flex items-center gap-2 mr-4">
				<Ticket className="h-5 w-5" />
				<span className="font-semibold hidden sm:inline">Boletrics</span>
			</Link>

			{/* Search */}
			<div className="flex-1 max-w-md">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Buscar eventos, órdenes..."
						className="pl-9 h-9"
					/>
				</div>
			</div>

			<div className="flex items-center gap-2 ml-auto">
				{/* Quick Actions */}
				<Button variant="default" size="sm" asChild className="hidden sm:flex">
					<Link href="/org/events/new">Crear evento</Link>
				</Button>

				{/* Notifications */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="h-5 w-5" />
							<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
								3
							</Badge>
							<span className="sr-only">Notificaciones</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<p className="font-medium">Nueva venta</p>
							<p className="text-sm text-muted-foreground">
								Se vendieron 5 boletos para Bad Bunny World Tour
							</p>
							<p className="text-xs text-muted-foreground">Hace 5 minutos</p>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<p className="font-medium">Solicitud de reembolso</p>
							<p className="text-sm text-muted-foreground">
								Orden #12345 solicita reembolso
							</p>
							<p className="text-xs text-muted-foreground">Hace 1 hora</p>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-col items-start gap-1">
							<p className="font-medium">Evento casi agotado</p>
							<p className="text-sm text-muted-foreground">
								Coldplay tiene 95% de ocupación
							</p>
							<p className="text-xs text-muted-foreground">Hace 2 horas</p>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-center justify-center font-medium">
							Ver todas las notificaciones
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<ThemeToggle />
			</div>
		</header>
	);
}
