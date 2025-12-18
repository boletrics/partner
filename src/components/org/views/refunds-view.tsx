"use client";

import { useState } from "react";
import { RefreshCcw, Search, CheckCircle, XCircle, Clock } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { JSX } from "react";

const mockRefunds = [
	{
		id: "REF-2025-0018",
		orderId: "ORD-2025-0138",
		customer: "Pedro Martínez",
		event: "Karol G - Mañana Será Bonito Tour",
		amount: 8000,
		reason: "No puedo asistir",
		status: "approved",
		requestDate: "2025-01-18T10:30:00Z",
		processedDate: "2025-01-18T14:20:00Z",
	},
	{
		id: "REF-2025-0017",
		orderId: "ORD-2025-0135",
		customer: "María González",
		event: "Festival Vive Latino 2025",
		amount: 5000,
		reason: "Evento cancelado",
		status: "approved",
		requestDate: "2025-01-17T16:45:00Z",
		processedDate: "2025-01-17T18:30:00Z",
	},
	{
		id: "REF-2025-0016",
		orderId: "ORD-2025-0131",
		customer: "Juan Ramírez",
		event: "Coldplay - Music of the Spheres",
		amount: 13500,
		reason: "Compra duplicada",
		status: "pending",
		requestDate: "2025-01-17T09:15:00Z",
	},
	{
		id: "REF-2025-0015",
		orderId: "ORD-2025-0128",
		customer: "Sofia Torres",
		event: "Bad Bunny - Most Wanted Tour",
		amount: 7800,
		reason: "Precio incorrecto",
		status: "rejected",
		requestDate: "2025-01-16T14:20:00Z",
		processedDate: "2025-01-17T10:00:00Z",
	},
];

export function RefundsView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredRefunds = mockRefunds.filter((refund) => {
		const matchesSearch =
			refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			refund.customer.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || refund.status === statusFilter;
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
		approved: "Aprobado",
		pending: "Pendiente",
		rejected: "Rechazado",
	};

	const statusIcons: Record<string, JSX.Element> = {
		approved: <CheckCircle className="h-4 w-4" />,
		pending: <Clock className="h-4 w-4" />,
		rejected: <XCircle className="h-4 w-4" />,
	};

	const statusColors: Record<string, string> = {
		approved: "default",
		pending: "secondary",
		rejected: "destructive",
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="min-w-0">
				<h1 className="text-xl md:text-2xl font-bold tracking-tight">
					Reembolsos
				</h1>
				<p className="text-muted-foreground text-sm">
					Gestiona las solicitudes de reembolso
				</p>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Pendientes</span>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">1</div>
						<p className="text-xs text-muted-foreground">Requieren atención</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Aprobados (30d)</span>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">$45,800</div>
						<p className="text-xs text-muted-foreground">18 reembolsos</p>
					</CardContent>
				</Card>

				<Card className="sm:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Tasa de rechazo</span>
						<RefreshCcw className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">5.2%</div>
						<p className="text-xs text-muted-foreground">Último mes</p>
					</CardContent>
				</Card>
			</div>

			<div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="w-max">
						<TabsTrigger value="all">Todos ({mockRefunds.length})</TabsTrigger>
						<TabsTrigger value="pending">Pendientes (1)</TabsTrigger>
						<TabsTrigger value="approved">Aprobados (2)</TabsTrigger>
						<TabsTrigger value="rejected">Rechazados (1)</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<Card className="overflow-hidden">
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar por ID o cliente..."
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
								<SelectItem value="pending">Pendientes</SelectItem>
								<SelectItem value="approved">Aprobados</SelectItem>
								<SelectItem value="rejected">Rechazados</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
					<div className="overflow-x-auto">
						<div className="rounded-md border min-w-[900px]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Cliente</TableHead>
										<TableHead>Evento</TableHead>
										<TableHead>Monto</TableHead>
										<TableHead>Razón</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead>Fecha solicitud</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRefunds.map((refund) => (
										<TableRow key={refund.id}>
											<TableCell className="font-mono text-sm">
												{refund.id}
											</TableCell>
											<TableCell className="font-medium whitespace-nowrap">
												{refund.customer}
											</TableCell>
											<TableCell className="max-w-[180px] truncate">
												{refund.event}
											</TableCell>
											<TableCell className="font-semibold whitespace-nowrap">
												{formatCurrency(refund.amount)}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
												{refund.reason}
											</TableCell>
											<TableCell>
												<Badge
													variant={statusColors[refund.status] as any}
													className="gap-1"
												>
													{statusIcons[refund.status]}
													{statusLabels[refund.status]}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
												{formatDateTime(refund.requestDate)}
											</TableCell>
											<TableCell>
												{refund.status === "pending" && (
													<div className="flex gap-1">
														<Button
															size="sm"
															variant="outline"
															className="h-8 bg-transparent"
														>
															Aprobar
														</Button>
														<Button size="sm" variant="ghost" className="h-8">
															Rechazar
														</Button>
													</div>
												)}
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
