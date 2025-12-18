"use client";

import {
	ArrowLeft,
	ArrowUpRight,
	ArrowDownRight,
	Search,
	Download,
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useNavigationStore } from "@/lib/navigation-store";
import type { JSX } from "react";

const mockTransactions = [
	{
		id: "TXN-2025-0845",
		type: "income",
		description: "Venta de boletos - Bad Bunny",
		amount: 7800,
		fee: 624,
		net: 7176,
		date: "2025-01-18T15:30:00Z",
		status: "completed",
	},
	{
		id: "TXN-2025-0844",
		type: "income",
		description: "Venta de boletos - Festival Vive Latino",
		amount: 10000,
		fee: 800,
		net: 9200,
		date: "2025-01-18T14:20:00Z",
		status: "completed",
	},
	{
		id: "TXN-2025-0843",
		type: "refund",
		description: "Reembolso - Karol G Tour",
		amount: 8000,
		fee: 0,
		net: -8000,
		date: "2025-01-18T13:15:00Z",
		status: "completed",
	},
	{
		id: "TXN-2025-0842",
		type: "payout",
		description: "Retiro a cuenta bancaria",
		amount: 2500000,
		fee: 0,
		net: -2500000,
		date: "2025-01-15T10:00:00Z",
		status: "completed",
	},
	{
		id: "TXN-2025-0841",
		type: "income",
		description: "Venta de boletos - Coldplay",
		amount: 13500,
		fee: 1080,
		net: 12420,
		date: "2025-01-18T11:45:00Z",
		status: "pending",
	},
];

export function FinanceTransactionsView() {
	const { setView } = useNavigationStore();

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

	const typeLabels: Record<string, string> = {
		income: "Ingreso",
		refund: "Reembolso",
		payout: "Retiro",
	};

	const typeIcons: Record<string, JSX.Element> = {
		income: <ArrowDownRight className="h-4 w-4 text-green-600" />,
		refund: <ArrowUpRight className="h-4 w-4 text-red-600" />,
		payout: <ArrowUpRight className="h-4 w-4 text-blue-600" />,
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" onClick={() => setView("finance")}>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div className="flex-1 min-w-0">
					<h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
						Transacciones
					</h1>
					<p className="text-muted-foreground text-sm">
						Historial completo de movimientos
					</p>
				</div>
				<Button
					variant="outline"
					className="gap-2 bg-transparent hidden sm:flex"
				>
					<Download className="h-4 w-4" />
					Exportar
				</Button>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Total ingresos (30d)</span>
						<ArrowDownRight className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold text-green-600">
							{formatCurrency(8945600)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							245 transacciones
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Total egresos (30d)</span>
						<ArrowUpRight className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold text-red-600">
							-{formatCurrency(3258900)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							18 transacciones
						</p>
					</CardContent>
				</Card>

				<Card className="sm:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Balance neto (30d)</span>
						<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(5686700)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							263 transacciones totales
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className="overflow-hidden">
				<CardHeader>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Buscar transacciones..." className="pl-9" />
						</div>
						<Select defaultValue="all">
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los tipos</SelectItem>
								<SelectItem value="income">Ingresos</SelectItem>
								<SelectItem value="refund">Reembolsos</SelectItem>
								<SelectItem value="payout">Retiros</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="p-0 md:p-6 md:pt-0">
					<div className="overflow-x-auto">
						<div className="rounded-md border min-w-[700px]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Tipo</TableHead>
										<TableHead>Descripción</TableHead>
										<TableHead>Monto bruto</TableHead>
										<TableHead>Comisión</TableHead>
										<TableHead>Neto</TableHead>
										<TableHead>Fecha</TableHead>
										<TableHead>Estado</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockTransactions.map((txn) => (
										<TableRow key={txn.id}>
											<TableCell className="font-mono text-sm">
												{txn.id}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{typeIcons[txn.type]}
													<span className="text-sm">
														{typeLabels[txn.type]}
													</span>
												</div>
											</TableCell>
											<TableCell className="max-w-[200px] truncate">
												{txn.description}
											</TableCell>
											<TableCell className="font-medium">
												{formatCurrency(txn.amount)}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{txn.fee > 0 ? `-${formatCurrency(txn.fee)}` : "—"}
											</TableCell>
											<TableCell
												className={`font-semibold ${txn.net > 0 ? "text-green-600" : txn.net < 0 ? "text-red-600" : ""}`}
											>
												{formatCurrency(Math.abs(txn.net))}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
												{formatDateTime(txn.date)}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														txn.status === "completed" ? "default" : "secondary"
													}
												>
													{txn.status === "completed"
														? "Completada"
														: "Pendiente"}
												</Badge>
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
