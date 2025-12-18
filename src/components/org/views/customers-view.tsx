"use client";

import { useState } from "react";
import { Users, Search, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const mockCustomers = [
	{
		id: "1",
		name: "Carlos Rodríguez",
		email: "carlos@email.com",
		phone: "+52 55 1234 5678",
		city: "Ciudad de México",
		totalOrders: 8,
		totalSpent: 45600,
		lastPurchase: "2025-01-18",
	},
	{
		id: "2",
		name: "Ana María López",
		email: "ana@email.com",
		phone: "+52 81 8765 4321",
		city: "Monterrey",
		totalOrders: 12,
		totalSpent: 78900,
		lastPurchase: "2025-01-18",
	},
	{
		id: "3",
		name: "Miguel Hernández",
		email: "miguel@email.com",
		phone: "+52 33 2345 6789",
		city: "Guadalajara",
		totalOrders: 5,
		totalSpent: 28300,
		lastPurchase: "2025-01-17",
	},
	{
		id: "4",
		name: "Laura Sánchez",
		email: "laura@email.com",
		phone: "+52 998 7654 3210",
		city: "Cancún",
		totalOrders: 15,
		totalSpent: 125400,
		lastPurchase: "2025-01-16",
	},
	{
		id: "5",
		name: "Pedro Martínez",
		email: "pedro@email.com",
		phone: "+52 55 9876 5432",
		city: "Ciudad de México",
		totalOrders: 3,
		totalSpent: 18700,
		lastPurchase: "2025-01-15",
	},
];

export function CustomersView() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCustomers = mockCustomers.filter(
		(customer) =>
			customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			customer.city.toLowerCase().includes(searchQuery.toLowerCase()),
	);

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
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="min-w-0">
				<h1 className="text-xl md:text-2xl font-bold tracking-tight">
					Clientes
				</h1>
				<p className="text-muted-foreground text-sm">
					Base de datos de compradores
				</p>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Total clientes</span>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">15,230</div>
						<p className="text-xs text-muted-foreground">
							+12.5% vs mes anterior
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Clientes activos</span>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">8,450</div>
						<p className="text-xs text-muted-foreground">Último mes</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Ticket promedio</span>
						<ShoppingBag className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">$1,605</div>
						<p className="text-xs text-muted-foreground">Por compra</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Tasa de retorno</span>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">42.8%</div>
						<p className="text-xs text-muted-foreground">
							Clientes recurrentes
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className="overflow-hidden">
				<CardHeader>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar clientes por nombre, email o ciudad..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
					<div className="overflow-x-auto">
						<div className="rounded-md border min-w-[700px]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Cliente</TableHead>
										<TableHead>Contacto</TableHead>
										<TableHead>Ciudad</TableHead>
										<TableHead>Órdenes</TableHead>
										<TableHead>Total gastado</TableHead>
										<TableHead>Última compra</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCustomers.map((customer) => (
										<TableRow key={customer.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 shrink-0">
														<AvatarFallback>
															{customer.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0">
														<p className="font-medium truncate">
															{customer.name}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<Mail className="h-3 w-3 shrink-0" />
														<span className="truncate">{customer.email}</span>
													</div>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<Phone className="h-3 w-3 shrink-0" />
														<span className="whitespace-nowrap">
															{customer.phone}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 text-muted-foreground">
													<MapPin className="h-4 w-4 shrink-0" />
													<span className="whitespace-nowrap">
														{customer.city}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{customer.totalOrders} órdenes
												</Badge>
											</TableCell>
											<TableCell className="font-semibold whitespace-nowrap">
												{formatCurrency(customer.totalSpent)}
											</TableCell>
											<TableCell className="text-muted-foreground whitespace-nowrap">
												{formatDate(customer.lastPurchase)}
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
