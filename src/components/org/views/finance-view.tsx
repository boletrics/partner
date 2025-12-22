"use client";

import {
	Wallet,
	TrendingUp,
	DollarSign,
	Clock,
	ArrowUpRight,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function FinanceView() {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="min-w-0">
					<h1 className="text-xl md:text-2xl font-bold tracking-tight">
						Finanzas
					</h1>
					<p className="text-muted-foreground text-sm">
						Resumen financiero de tu organización
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link href="/finance/payouts">
						<Wallet className="h-4 w-4" />
						Ver retiros
					</Link>
				</Button>
			</div>

			{/* Main Balance */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="min-w-0 flex-1">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Saldo disponible
							</CardTitle>
							<div className="text-2xl md:text-4xl font-bold mt-2">
								$3,245,890
							</div>
						</div>
						<Wallet className="h-10 w-10 md:h-12 md:w-12 text-primary shrink-0" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<Button className="flex-1">Solicitar retiro</Button>
						<Button variant="outline" className="flex-1 bg-transparent" asChild>
							<Link href="/finance/transactions">Ver transacciones</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Ingresos (30d)</span>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(8945600)}
						</div>
						<div className="flex items-center gap-1 text-xs text-green-600 mt-1">
							<ArrowUpRight className="h-3 w-3" />
							<span>+15.2% vs mes anterior</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Comisiones (30d)</span>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(715648)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							8% de comisión promedio
						</p>
					</CardContent>
				</Card>

				<Card className="sm:col-span-2 lg:col-span-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Pendiente de pago</span>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">
							{formatCurrency(1456200)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Se procesará en 3 días
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Payment Schedule */}
			<Card>
				<CardHeader>
					<CardTitle>Calendario de pagos</CardTitle>
					<CardDescription>Próximos retiros programados</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[
						{
							date: "22 de enero, 2025",
							amount: 1456200,
							status: "programado",
							progress: 75,
						},
						{
							date: "29 de enero, 2025",
							amount: 890400,
							status: "estimado",
							progress: 35,
						},
						{
							date: "5 de febrero, 2025",
							amount: 1245800,
							status: "estimado",
							progress: 15,
						},
					].map((payout, i) => (
						<div key={i} className="p-4 rounded-lg border space-y-3">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
								<div className="min-w-0">
									<p className="font-medium">{payout.date}</p>
									<p className="text-sm text-muted-foreground">
										{formatCurrency(payout.amount)}
									</p>
								</div>
								<Badge
									variant={
										payout.status === "programado" ? "default" : "secondary"
									}
								>
									{payout.status === "programado" ? "Programado" : "Estimado"}
								</Badge>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>Progreso del período</span>
									<span>{payout.progress}%</span>
								</div>
								<Progress value={payout.progress} className="h-2" />
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Resumen anual</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between items-center gap-2">
							<span className="text-muted-foreground text-sm">
								Total procesado
							</span>
							<span className="font-semibold">{formatCurrency(45678900)}</span>
						</div>
						<div className="flex justify-between items-center gap-2">
							<span className="text-muted-foreground text-sm">
								Total en comisiones
							</span>
							<span className="font-semibold text-red-600">
								-{formatCurrency(3654312)}
							</span>
						</div>
						<div className="flex justify-between items-center gap-2">
							<span className="text-muted-foreground text-sm">Reembolsos</span>
							<span className="font-semibold text-red-600">
								-{formatCurrency(458900)}
							</span>
						</div>
						<div className="flex justify-between items-center pt-3 border-t gap-2">
							<span className="font-semibold">Neto recibido</span>
							<span className="font-bold text-lg">
								{formatCurrency(41565688)}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Información fiscal</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="flex justify-between text-sm gap-2">
								<span className="text-muted-foreground">RFC registrado</span>
								<span className="font-mono">OCE850101ABC</span>
							</div>
							<div className="flex justify-between text-sm gap-2">
								<span className="text-muted-foreground">Régimen fiscal</span>
								<span className="truncate">Personas Morales</span>
							</div>
							<div className="flex justify-between text-sm gap-2">
								<span className="text-muted-foreground">
									Facturas emitidas (2025)
								</span>
								<span>142</span>
							</div>
						</div>
						<Button variant="outline" className="w-full bg-transparent">
							Descargar constancia fiscal
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
