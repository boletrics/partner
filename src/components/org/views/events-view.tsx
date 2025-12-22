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
import Link from "next/link";

const mockEvents = [
	{
		id: "1",
		name: "Festival Vive Latino 2025",
		date: "2025-03-15",
		time: "14:00",
		venue: "Foro Sol, CDMX",
		capacity: 65000,
		sold: 48500,
		revenue: 122500000,
		status: "active",
	},
	{
		id: "2",
		name: "Bad Bunny - Most Wanted Tour",
		date: "2025-04-20",
		time: "20:00",
		venue: "Estadio Azteca, CDMX",
		capacity: 87000,
		sold: 85200,
		revenue: 340800000,
		status: "active",
	},
	{
		id: "3",
		name: "Shakira - Las Mujeres Ya No Lloran",
		date: "2025-05-10",
		time: "21:00",
		venue: "Palacio de los Deportes, CDMX",
		capacity: 17800,
		sold: 16200,
		revenue: 72900000,
		status: "active",
	},
	{
		id: "4",
		name: "Coldplay - Music of the Spheres",
		date: "2025-06-05",
		time: "20:30",
		venue: "Estadio BBVA, Monterrey",
		capacity: 53500,
		sold: 24800,
		revenue: 111600000,
		status: "active",
	},
	{
		id: "5",
		name: "Karol G - Mañana Será Bonito Tour",
		date: "2025-07-18",
		time: "21:00",
		venue: "Arena Monterrey",
		capacity: 18000,
		sold: 8900,
		revenue: 35600000,
		status: "scheduled",
	},
];

export function EventsView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredEvents = mockEvents.filter((event) => {
		const matchesSearch =
			event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.venue.toLowerCase().includes(searchQuery.toLowerCase());
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

	return (
		<div className="p-4 md:p-6 space-y-6 min-w-0 w-full">
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

			<Tabs defaultValue="all" className="w-full">
				<TabsList className="w-max">
					<TabsTrigger value="all">Todos ({mockEvents.length})</TabsTrigger>
					<TabsTrigger value="active">Activos (4)</TabsTrigger>
					<TabsTrigger value="scheduled">Programados (1)</TabsTrigger>
					<TabsTrigger value="ended">Finalizados (0)</TabsTrigger>
				</TabsList>
			</Tabs>

			<Card className="overflow-hidden w-full">
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1 min-w-0">
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
								<SelectItem value="active">Activos</SelectItem>
								<SelectItem value="scheduled">Programados</SelectItem>
								<SelectItem value="ended">Finalizados</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
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
									{filteredEvents.map((event) => (
										<TableRow key={event.id}>
											<TableCell className="font-medium max-w-[200px] truncate">
												{event.name}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
													<Calendar className="h-4 w-4 shrink-0" />
													{formatDate(event.date)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 text-muted-foreground">
													<MapPin className="h-4 w-4 shrink-0" />
													<span className="truncate max-w-[150px]">
														{event.venue}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 whitespace-nowrap">
													<Users className="h-4 w-4 text-muted-foreground shrink-0" />
													<span>
														{event.sold.toLocaleString()} /{" "}
														{event.capacity.toLocaleString()}
													</span>
													<span className="text-xs text-muted-foreground">
														({Math.round((event.sold / event.capacity) * 100)}%)
													</span>
												</div>
											</TableCell>
											<TableCell className="font-semibold whitespace-nowrap">
												{formatCurrency(event.revenue)}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														event.status === "active" ? "default" : "secondary"
													}
												>
													{event.status === "active" ? "Activo" : "Programado"}
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
														<DropdownMenuItem>
															<Edit className="mr-2 h-4 w-4" />
															Editar evento
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Copy className="mr-2 h-4 w-4" />
															Duplicar evento
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="text-destructive">
															<Trash className="mr-2 h-4 w-4" />
															Eliminar evento
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
