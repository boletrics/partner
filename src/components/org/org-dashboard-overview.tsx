"use client";

import type React from "react";

import { useMemo } from "react";
import {
	Ticket,
	DollarSign,
	Calendar,
	Users,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useOrgStore } from "@/lib/org-store";
import {
	mockDashboardStats,
	mockRevenueData,
	mockEventPerformance,
	type OrgDashboardStats,
	type OrgRevenueData,
	type OrgEventPerformance,
} from "@/lib/org-mock-data";

function formatCurrency(amount: number, currency = "MXN") {
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatNumber(num: number) {
	return new Intl.NumberFormat("es-MX").format(num);
}

interface StatCardProps {
	title: string;
	value: string;
	description: string;
	icon: React.ElementType;
	trend?: number;
	trendLabel?: string;
}

function StatCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	trendLabel,
}: StatCardProps) {
	const isPositive = trend && trend > 0;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-xl md:text-2xl font-bold">{value}</div>
				<div className="flex items-center gap-2 mt-1">
					{trend !== undefined && (
						<Badge
							variant={isPositive ? "default" : "destructive"}
							className="gap-1 px-1.5 py-0.5 text-xs"
						>
							{isPositive ? (
								<ArrowUpRight className="h-3 w-3" />
							) : (
								<ArrowDownRight className="h-3 w-3" />
							)}
							{Math.abs(trend)}%
						</Badge>
					)}
					<p className="text-xs text-muted-foreground">
						{trendLabel || description}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

function RevenueChart({ data }: { data: OrgRevenueData[] }) {
	const chartConfig = {
		revenue: {
			label: "Ingresos",
			color: "hsl(var(--chart-1))",
		},
	};

	return (
		<Card className="col-span-full lg:col-span-2 overflow-hidden">
			<CardHeader>
				<CardTitle>Ingresos por Mes</CardTitle>
				<CardDescription>Últimos 7 meses de ventas</CardDescription>
			</CardHeader>
			<CardContent className="p-2 md:p-6 md:pt-0">
				<ChartContainer
					config={chartConfig}
					className="h-[250px] md:h-[300px] w-full"
				>
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-1))"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-1))"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10 }}
							className="text-muted-foreground"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10 }}
							tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
							className="text-muted-foreground"
							width={50}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value) => formatCurrency(Number(value))}
									labelFormatter={(label) => `Mes: ${label}`}
								/>
							}
						/>
						<Area
							type="monotone"
							dataKey="revenue"
							stroke="hsl(var(--chart-1))"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorRevenue)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function TicketsChart({ data }: { data: OrgRevenueData[] }) {
	const chartConfig = {
		tickets: {
			label: "Boletos",
			color: "hsl(var(--chart-2))",
		},
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Boletos Vendidos</CardTitle>
				<CardDescription>Por mes</CardDescription>
			</CardHeader>
			<CardContent className="p-2 md:p-6 md:pt-0">
				<ChartContainer
					config={chartConfig}
					className="h-[250px] md:h-[300px] w-full"
				>
					<BarChart
						data={data}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-muted"
							vertical={false}
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10 }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10 }}
							tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
							width={40}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value) => formatNumber(Number(value))}
									labelFormatter={(label) => `Mes: ${label}`}
								/>
							}
						/>
						<Bar
							dataKey="tickets"
							fill="hsl(var(--chart-2))"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function EventPerformanceCard({ events }: { events: OrgEventPerformance[] }) {
	return (
		<Card className="col-span-full">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div>
						<CardTitle>Rendimiento de Eventos</CardTitle>
						<CardDescription>Eventos activos con más ventas</CardDescription>
					</div>
					<Button variant="outline" size="sm">
						Ver todos
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{events.map((event) => (
						<div key={event.eventId} className="space-y-2">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{event.eventName}</p>
									<p className="text-sm text-muted-foreground">
										{formatNumber(event.ticketsSold)} /{" "}
										{formatNumber(event.capacity)} boletos
									</p>
								</div>
								<div className="text-left sm:text-right">
									<p className="font-semibold">
										{formatCurrency(event.revenue)}
									</p>
									<Badge
										variant={
											event.soldPercentage >= 90
												? "default"
												: event.soldPercentage >= 70
													? "secondary"
													: "outline"
										}
										className="mt-1"
									>
										{event.soldPercentage.toFixed(1)}% vendido
									</Badge>
								</div>
							</div>
							<Progress value={event.soldPercentage} className="h-2" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function QuickActions() {
	const actions = [
		{ label: "Crear evento", href: "/org/events/new", primary: true },
		{ label: "Ver órdenes", href: "/org/orders" },
		{ label: "Escanear boletos", href: "/org/scan" },
		{ label: "Solicitar retiro", href: "/org/finance/payouts" },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Acciones Rápidas</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2">
				{actions.map((action) => (
					<Button
						key={action.label}
						variant={action.primary ? "default" : "outline"}
						className="w-full justify-start"
						asChild
					>
						<a href={action.href}>{action.label}</a>
					</Button>
				))}
			</CardContent>
		</Card>
	);
}

export function OrgDashboardOverview() {
	const { currentOrg } = useOrgStore();

	const stats = useMemo<OrgDashboardStats | null>(() => {
		if (!currentOrg) return null;
		return mockDashboardStats[currentOrg.id] || null;
	}, [currentOrg]);

	const revenueData = useMemo<OrgRevenueData[]>(() => {
		if (!currentOrg) return [];
		return mockRevenueData[currentOrg.id] || mockRevenueData["org-1"] || [];
	}, [currentOrg]);

	const eventPerformance = useMemo<OrgEventPerformance[]>(() => {
		if (!currentOrg) return [];
		return (
			mockEventPerformance[currentOrg.id] || mockEventPerformance["org-1"] || []
		);
	}, [currentOrg]);

	if (!stats) {
		return (
			<div className="flex items-center justify-center h-96">
				<p className="text-muted-foreground">No hay datos disponibles</p>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			{/* Welcome Header */}
			<div className="min-w-0">
				<h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
					Bienvenido, {currentOrg?.name}
				</h1>
				<p className="text-muted-foreground text-sm">
					Aquí tienes un resumen de tu actividad reciente
				</p>
			</div>

			{/* Stats Grid - responsive columns */}
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Ingresos Totales"
					value={formatCurrency(stats.totalRevenue)}
					description="Este mes"
					icon={DollarSign}
					trend={stats.revenueGrowth}
					trendLabel="vs. mes anterior"
				/>
				<StatCard
					title="Boletos Vendidos"
					value={formatNumber(stats.ticketsSold)}
					description="Este mes"
					icon={Ticket}
					trend={8.2}
					trendLabel="vs. mes anterior"
				/>
				<StatCard
					title="Eventos Activos"
					value={stats.activeEvents.toString()}
					description={`${stats.upcomingEvents} próximos`}
					icon={Calendar}
				/>
				<StatCard
					title="Clientes"
					value={formatNumber(stats.totalCustomers)}
					description="Total registrados"
					icon={Users}
					trend={stats.conversionRate}
					trendLabel="tasa de conversión"
				/>
			</div>

			{/* Charts - responsive grid */}
			<div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
				<RevenueChart data={revenueData} />
				<TicketsChart data={revenueData} />
			</div>

			{/* Event Performance & Quick Actions - responsive */}
			<div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
				<div className="lg:col-span-3">
					<EventPerformanceCard events={eventPerformance} />
				</div>
				<QuickActions />
			</div>
		</div>
	);
}
