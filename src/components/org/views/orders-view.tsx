"use client";

import { useState } from "react";
import {
	Search,
	Download,
	MoreHorizontal,
	Eye,
	RefreshCcw,
	XCircle,
	Loader2,
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
	useOrganizationOrders,
	useCancelOrder,
	useRefundOrder,
} from "@/lib/api/hooks/use-orders";
import { useOrgStore } from "@/lib/org-store";
import type { Order } from "@/lib/api/types";
import { toast } from "sonner";

export function OrdersView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const { currentOrg } = useOrgStore();
	const {
		data: ordersResult,
		isLoading,
		error,
		mutate,
	} = useOrganizationOrders({
		status:
			statusFilter !== "all" ? (statusFilter as Order["status"]) : undefined,
	});

	const orders = ordersResult?.data ?? [];

	// Count orders by status
	const statusCounts = {
		all: orders.length,
		pending: orders.filter((o) => o.status === "pending").length,
		paid: orders.filter((o) => o.status === "paid").length,
		cancelled: orders.filter((o) => o.status === "cancelled").length,
		refunded: orders.filter((o) => o.status === "refunded").length,
	};

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.email.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
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
		paid: "Pagada",
		pending: "Pendiente",
		cancelled: "Cancelada",
		refunded: "Reembolsada",
	};

	const statusColors: Record<
		string,
		"default" | "secondary" | "destructive" | "outline"
	> = {
		paid: "default",
		pending: "secondary",
		cancelled: "destructive",
		refunded: "outline",
	};

	const handleCancelOrder = async (orderId: string) => {
		try {
			const { cancelOrder } = useCancelOrder(orderId);
			await cancelOrder();
			mutate();
			toast.success("Orden cancelada");
		} catch (error) {
			toast.error("Error al cancelar la orden");
		}
	};

	const handleRefundOrder = async (orderId: string) => {
		try {
			const { refundOrder } = useRefundOrder(orderId);
			await refundOrder();
			mutate();
			toast.success("Reembolso procesado");
		} catch (error) {
			toast.error("Error al procesar el reembolso");
		}
	};

	if (!currentOrg) {
		return (
			<div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">
					Selecciona una organización para ver las órdenes
				</p>
			</div>
		);
	}

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
				<Tabs defaultValue="all" onValueChange={setStatusFilter}>
					<TabsList className="w-max">
						<TabsTrigger value="all">Todas ({statusCounts.all})</TabsTrigger>
						<TabsTrigger value="paid">
							Pagadas ({statusCounts.paid})
						</TabsTrigger>
						<TabsTrigger value="pending">
							Pendientes ({statusCounts.pending})
						</TabsTrigger>
						<TabsTrigger value="refunded">
							Reembolsadas ({statusCounts.refunded})
						</TabsTrigger>
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
								<SelectItem value="paid">Pagadas</SelectItem>
								<SelectItem value="pending">Pendientes</SelectItem>
								<SelectItem value="cancelled">Canceladas</SelectItem>
								<SelectItem value="refunded">Reembolsadas</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-destructive">Error al cargar órdenes</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => mutate()}
							>
								Reintentar
							</Button>
						</div>
					) : filteredOrders.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								{orders.length === 0
									? "No hay órdenes aún"
									: "No se encontraron órdenes con los filtros aplicados"}
							</p>
						</div>
					) : (
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
													{order.order_number}
												</TableCell>
												<TableCell>
													<div>
														<p className="font-medium truncate max-w-[150px]">
															{order.email}
														</p>
													</div>
												</TableCell>
												<TableCell className="max-w-[200px] truncate">
													{order.event?.title ?? "Evento"}
												</TableCell>
												<TableCell>
													<Badge variant="outline">
														{order.items?.reduce(
															(acc, item) => acc + item.quantity,
															0,
														) ?? 0}{" "}
														boletos
													</Badge>
												</TableCell>
												<TableCell className="font-semibold">
													{formatCurrency(order.total)}
												</TableCell>
												<TableCell>
													<Badge variant={statusColors[order.status]}>
														{statusLabels[order.status]}
													</Badge>
												</TableCell>
												<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
													{formatDateTime(order.created_at)}
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
															<DropdownMenuItem
																onClick={() => setSelectedOrder(order)}
															>
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
															{order.status === "paid" && (
																<>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem
																		className="text-destructive"
																		onClick={() => handleRefundOrder(order.id)}
																	>
																		<XCircle className="mr-2 h-4 w-4" />
																		Reembolsar
																	</DropdownMenuItem>
																</>
															)}
															{order.status === "pending" && (
																<DropdownMenuItem
																	className="text-destructive"
																	onClick={() => handleCancelOrder(order.id)}
																>
																	<XCircle className="mr-2 h-4 w-4" />
																	Cancelar orden
																</DropdownMenuItem>
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
					)}
				</CardContent>
			</Card>

			{/* Order Details Dialog */}
			<Dialog
				open={!!selectedOrder}
				onOpenChange={() => setSelectedOrder(null)}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Detalles de la orden</DialogTitle>
						<DialogDescription>
							Orden #{selectedOrder?.order_number}
						</DialogDescription>
					</DialogHeader>
					{selectedOrder && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Email</p>
									<p className="font-medium">{selectedOrder.email}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Estado</p>
									<Badge variant={statusColors[selectedOrder.status]}>
										{statusLabels[selectedOrder.status]}
									</Badge>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Fecha</p>
									<p className="font-medium">
										{formatDateTime(selectedOrder.created_at)}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total</p>
									<p className="font-medium">
										{formatCurrency(selectedOrder.total)}
									</p>
								</div>
							</div>
							<div>
								<p className="text-sm text-muted-foreground mb-2">Desglose</p>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>{formatCurrency(selectedOrder.subtotal)}</span>
									</div>
									<div className="flex justify-between">
										<span>Comisiones</span>
										<span>{formatCurrency(selectedOrder.fees)}</span>
									</div>
									<div className="flex justify-between">
										<span>IVA</span>
										<span>{formatCurrency(selectedOrder.tax)}</span>
									</div>
									<div className="flex justify-between font-bold pt-2 border-t">
										<span>Total</span>
										<span>{formatCurrency(selectedOrder.total)}</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
