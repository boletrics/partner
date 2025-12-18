"use client";

import { useState } from "react";
import {
	Search,
	Download,
	MoreHorizontal,
	Eye,
	RefreshCcw,
	XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const mockOrders = [
	{
		id: "ORD-2025-0142",
		customer: "Carlos Rodríguez",
		email: "carlos@email.com",
		event: "Bad Bunny - Most Wanted Tour",
		quantity: 2,
		total: 7800,
		status: "completed",
		date: "2025-01-18T15:30:00Z",
	},
	{
		id: "ORD-2025-0141",
		customer: "Ana María López",
		email: "ana@email.com",
		event: "Festival Vive Latino 2025",
		quantity: 4,
		total: 10000,
		status: "completed",
		date: "2025-01-18T14:20:00Z",
	},
	{
		id: "ORD-2025-0140",
		customer: "Miguel Hernández",
		email: "miguel@email.com",
		event: "Shakira - Las Mujeres Ya No Lloran",
		quantity: 1,
		total: 4500,
		status: "pending",
		date: "2025-01-18T13:15:00Z",
	},
	{
		id: "ORD-2025-0139",
		customer: "Laura Sánchez",
		email: "laura@email.com",
		event: "Coldplay - Music of the Spheres",
		quantity: 3,
		total: 13500,
		status: "completed",
		date: "2025-01-18T11:45:00Z",
	},
	{
		id: "ORD-2025-0138",
		customer: "Pedro Martínez",
		email: "pedro@email.com",
		event: "Karol G - Mañana Será Bonito Tour",
		quantity: 2,
		total: 8000,
		status: "cancelled",
		date: "2025-01-18T10:30:00Z",
	},
];

export function OrdersView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredOrders = mockOrders.filter((order) => {
		const matchesSearch =
			order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || order.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("es-MX", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const statusLabels: Record<string, string> = {
		completed: "Completada",
		pending: "Pendiente",
		cancelled: "Cancelada",
	};

	const statusColors: Record<string, string> = {
		completed: "default",
		pending: "secondary",
		cancelled: "destructive",
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="min-w-0">
					<h1 className="text-xl md:text-2xl font-bold tracking-tight">
						Órdenes
					</h1>
					<p className="text-muted-foreground text-sm">
						Gestiona todas las órdenes de compra
					</p>
				</div>
				<Button variant="outline" className="gap-2 bg-transparent">
					<Download className="h-4 w-4" />
					Exportar
				</Button>
			</div>

			<div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="w-max">
						<TabsTrigger value="all">Todas ({mockOrders.length})</TabsTrigger>
						<TabsTrigger value="completed">Completadas (3)</TabsTrigger>
						<TabsTrigger value="pending">Pendientes (1)</TabsTrigger>
						<TabsTrigger value="cancelled">Canceladas (1)</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<Card className="overflow-hidden">
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar por ID, cliente o email..."
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
								<SelectItem value="completed">Completadas</SelectItem>
								<SelectItem value="pending">Pendientes</SelectItem>
								<SelectItem value="cancelled">Canceladas</SelectItem>
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
										<TableHead>ID de orden</TableHead>
										<TableHead>Cliente</TableHead>
										<TableHead>Evento</TableHead>
										<TableHead>Cantidad</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead>Fecha</TableHead>
										<TableHead className="w-[50px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredOrders.map((order) => (
										<TableRow key={order.id}>
											<TableCell className="font-mono text-sm">
												{order.id}
											</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{order.customer}</p>
													<p className="text-sm text-muted-foreground">
														{order.email}
													</p>
												</div>
											</TableCell>
											<TableCell className="max-w-[200px] truncate">
												{order.event}
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{order.quantity} boletos
												</Badge>
											</TableCell>
											<TableCell className="font-semibold">
												{formatCurrency(order.total)}
											</TableCell>
											<TableCell>
												<Badge variant={statusColors[order.status] as any}>
													{statusLabels[order.status]}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
												{formatDateTime(order.date)}
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
															<Eye className="mr-2 h-4 w-4" />
															Ver detalles
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Download className="mr-2 h-4 w-4" />
															Descargar boletos
														</DropdownMenuItem>
														{order.status === "pending" && (
															<>
																<DropdownMenuSeparator />
																<DropdownMenuItem>
																	<RefreshCcw className="mr-2 h-4 w-4" />
																	Reenviar confirmación
																</DropdownMenuItem>
															</>
														)}
														{order.status === "completed" && (
															<>
																<DropdownMenuSeparator />
																<DropdownMenuItem className="text-destructive">
																	<XCircle className="mr-2 h-4 w-4" />
																	Cancelar orden
																</DropdownMenuItem>
															</>
														)}
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
