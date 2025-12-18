"use client";

import {
	BarChart3,
	TrendingUp,
	Users,
	DollarSign,
	Calendar,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
} from "recharts";

const revenueData = [
	{ month: "Jul", revenue: 3200000, tickets: 2100 },
	{ month: "Ago", revenue: 4100000, tickets: 2600 },
	{ month: "Sep", revenue: 3800000, tickets: 2400 },
	{ month: "Oct", revenue: 5200000, tickets: 3200 },
	{ month: "Nov", revenue: 4600000, tickets: 2900 },
	{ month: "Dic", revenue: 6800000, tickets: 4100 },
	{ month: "Ene", revenue: 5400000, tickets: 3400 },
];

const categoryData = [
	{ category: "Conciertos", revenue: 18500000, percentage: 62 },
	{ category: "Festivales", revenue: 7200000, percentage: 24 },
	{ category: "Teatro", revenue: 2800000, percentage: 9 },
	{ category: "Deportes", revenue: 1500000, percentage: 5 },
];

export function AnalyticsView() {
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
			minimumFractionDigits: 0,
			notation: "compact",
		}).format(value);
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="min-w-0">
					<h1 className="text-xl md:text-2xl font-bold tracking-tight">
						Analíticas
					</h1>
					<p className="text-muted-foreground text-sm">
						Métricas y análisis de rendimiento
					</p>
				</div>
				<div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
					<Tabs defaultValue="7d">
						<TabsList className="w-max">
							<TabsTrigger value="7d">7 días</TabsTrigger>
							<TabsTrigger value="30d">30 días</TabsTrigger>
							<TabsTrigger value="90d">90 días</TabsTrigger>
							<TabsTrigger value="1y">1 año</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Ingresos totales</span>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">$45.6M</div>
						<div className="flex items-center gap-1 text-xs text-green-600">
							<ArrowUp className="h-3 w-3" />
							<span>+12.5% vs mes anterior</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Boletos vendidos</span>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">28,450</div>
						<div className="flex items-center gap-1 text-xs text-green-600">
							<ArrowUp className="h-3 w-3" />
							<span>+8.3% vs mes anterior</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Tasa de conversión</span>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">4.2%</div>
						<div className="flex items-center gap-1 text-xs text-red-600">
							<ArrowDown className="h-3 w-3" />
							<span>-0.3% vs mes anterior</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<span className="text-sm font-medium">Clientes únicos</span>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-xl md:text-2xl font-bold">15,230</div>
						<div className="flex items-center gap-1 text-xs text-green-600">
							<ArrowUp className="h-3 w-3" />
							<span>+18.2% vs mes anterior</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
				<Card className="overflow-hidden">
					<CardHeader>
						<CardTitle>Ingresos y boletos vendidos</CardTitle>
						<CardDescription>Últimos 7 meses</CardDescription>
					</CardHeader>
					<CardContent className="p-2 md:p-6 md:pt-0">
						<ChartContainer
							className="h-[250px] md:h-[300px] w-full"
							config={{
								revenue: {
									label: "Ingresos",
									color: "hsl(var(--chart-1))",
								},
								tickets: {
									label: "Boletos",
									color: "hsl(var(--chart-2))",
								},
							}}
						>
							<LineChart
								data={revenueData}
								margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									dataKey="month"
									className="text-xs"
									tick={{ fontSize: 10 }}
								/>
								<YAxis
									yAxisId="left"
									className="text-xs"
									tickFormatter={formatCurrency}
									tick={{ fontSize: 10 }}
									width={60}
								/>
								<YAxis
									yAxisId="right"
									orientation="right"
									className="text-xs"
									tick={{ fontSize: 10 }}
									width={40}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Legend wrapperStyle={{ fontSize: "12px" }} />
								<Line
									yAxisId="left"
									type="monotone"
									dataKey="revenue"
									stroke="var(--color-revenue)"
									strokeWidth={2}
									name="Ingresos"
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="tickets"
									stroke="var(--color-tickets)"
									strokeWidth={2}
									name="Boletos"
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>

				<Card className="overflow-hidden">
					<CardHeader>
						<CardTitle>Ingresos por categoría</CardTitle>
						<CardDescription>Distribución de ventas</CardDescription>
					</CardHeader>
					<CardContent className="p-2 md:p-6 md:pt-0">
						<ChartContainer
							className="h-[250px] md:h-[300px] w-full"
							config={{
								revenue: {
									label: "Ingresos",
									color: "hsl(var(--chart-1))",
								},
							}}
						>
							<BarChart
								data={categoryData}
								margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									dataKey="category"
									className="text-xs"
									tick={{ fontSize: 10 }}
								/>
								<YAxis
									className="text-xs"
									tickFormatter={formatCurrency}
									tick={{ fontSize: 10 }}
									width={60}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar
									dataKey="revenue"
									fill="var(--color-revenue)"
									name="Ingresos"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Métricas adicionales</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						<div className="p-4 rounded-lg border">
							<div className="flex items-center gap-2 mb-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Precio promedio</span>
							</div>
							<p className="text-xl md:text-2xl font-bold">$1,605</p>
							<p className="text-xs text-muted-foreground mt-1">
								Por boleto vendido
							</p>
						</div>

						<div className="p-4 rounded-lg border">
							<div className="flex items-center gap-2 mb-2">
								<Users className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Tasa de ocupación</span>
							</div>
							<p className="text-xl md:text-2xl font-bold">82.4%</p>
							<p className="text-xs text-muted-foreground mt-1">
								Capacidad promedio
							</p>
						</div>

						<div className="p-4 rounded-lg border sm:col-span-2 lg:col-span-1">
							<div className="flex items-center gap-2 mb-2">
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">ROI de marketing</span>
							</div>
							<p className="text-xl md:text-2xl font-bold">3.8x</p>
							<p className="text-xs text-muted-foreground mt-1">
								Retorno de inversión
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
