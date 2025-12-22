"use client";

import { ArrowLeft, Wallet, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Link from "next/link";
import type { JSX } from "react";

const mockPayouts = [
	{
		id: "PAY-2025-0024",
		amount: 2500000,
		fee: 0,
		net: 2500000,
		account: "BBVA **** 4521",
		status: "completed",
		requestDate: "2025-01-15T10:00:00Z",
		completedDate: "2025-01-15T16:30:00Z",
	},
	{
		id: "PAY-2025-0023",
		amount: 1800000,
		fee: 0,
		net: 1800000,
		account: "BBVA **** 4521",
		status: "completed",
		requestDate: "2025-01-08T10:00:00Z",
		completedDate: "2025-01-08T15:45:00Z",
	},
	{
		id: "PAY-2025-0022",
		amount: 3200000,
		fee: 0,
		net: 3200000,
		account: "BBVA **** 4521",
		status: "processing",
		requestDate: "2025-01-18T09:00:00Z",
	},
	{
		id: "PAY-2024-0221",
		amount: 2100000,
		fee: 0,
		net: 2100000,
		account: "BBVA **** 4521",
		status: "completed",
		requestDate: "2024-12-28T10:00:00Z",
		completedDate: "2024-12-29T14:20:00Z",
	},
];

export function FinancePayoutsView() {
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
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const statusLabels: Record<string, string> = {
		completed: "Completado",
		processing: "En proceso",
		failed: "Fallido",
	};

	const statusIcons: Record<string, JSX.Element> = {
		completed: <CheckCircle className="h-4 w-4" />,
		processing: <Clock className="h-4 w-4" />,
		failed: <XCircle className="h-4 w-4" />,
	};

	const statusColors: Record<string, string> = {
		completed: "default",
		processing: "secondary",
		failed: "destructive",
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/finance">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div className="flex-1 min-w-0">
					<h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
						Retiros
					</h1>
					<p className="text-muted-foreground text-sm">
						Historial de transferencias a tu cuenta
					</p>
				</div>
				<Button className="gap-2 hidden sm:flex">
					<Wallet className="h-4 w-4" />
					Nuevo retiro
				</Button>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Saldo disponible</span>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(3245890)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Listo para retirar
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">En proceso</span>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(3200000)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							1 retiro pendiente
						</p>
					</CardContent>
				</Card>

				<Card className="sm:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Total retirado (30d)</span>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(9600000)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">4 retiros</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Cuenta bancaria</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="p-4 rounded-lg border bg-muted/50">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
							<div>
								<p className="font-medium">BBVA Bancomer</p>
								<p className="text-sm text-muted-foreground">
									Cuenta **** **** **** 4521
								</p>
							</div>
							<Badge>Verificada</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden">
				<CardHeader>
					<CardTitle>Historial de retiros</CardTitle>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
					<div className="overflow-x-auto">
						<div className="rounded-md border min-w-[700px]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID de retiro</TableHead>
										<TableHead>Monto</TableHead>
										<TableHead>Cuenta destino</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead>Fecha de solicitud</TableHead>
										<TableHead>Fecha de pago</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockPayouts.map((payout) => (
										<TableRow key={payout.id}>
											<TableCell className="font-mono text-sm">
												{payout.id}
											</TableCell>
											<TableCell className="font-semibold">
												{formatCurrency(payout.net)}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{payout.account}
											</TableCell>
											<TableCell>
												<Badge
													variant={statusColors[payout.status] as any}
													className="gap-1"
												>
													{statusIcons[payout.status]}
													{statusLabels[payout.status]}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
												{formatDateTime(payout.requestDate)}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
												{payout.completedDate
													? formatDateTime(payout.completedDate)
													: "—"}
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
