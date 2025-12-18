"use client";

import { useState } from "react";
import {
	QrCode,
	CheckCircle,
	XCircle,
	AlertCircle,
	Camera,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ScanView() {
	const [scanResult, setScanResult] = useState<{
		status: "success" | "error" | "duplicate";
		message: string;
	} | null>(null);

	const handleManualScan = () => {
		const results = [
			{
				status: "success" as const,
				message: "Boleto válido - General Admisión - Carlos Rodríguez",
			},
			{ status: "error" as const, message: "Boleto inválido o ya usado" },
			{
				status: "duplicate" as const,
				message: "Este boleto ya fue escaneado hace 5 minutos",
			},
		];
		setScanResult(results[Math.floor(Math.random() * results.length)]);

		setTimeout(() => setScanResult(null), 5000);
	};

	return (
		<div className="p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
			<div className="min-w-0">
				<h1 className="text-xl md:text-2xl font-bold tracking-tight">
					Escaneo de boletos
				</h1>
				<p className="text-muted-foreground text-sm">
					Valida los boletos en el punto de entrada
				</p>
			</div>

			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<QrCode className="h-5 w-5" />
								Escáner QR
							</CardTitle>
							<CardDescription>Escanea el código QR del boleto</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="event-select">Evento activo</Label>
								<Select defaultValue="event-1">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="event-1">
											Bad Bunny - Most Wanted Tour
										</SelectItem>
										<SelectItem value="event-2">
											Festival Vive Latino 2025
										</SelectItem>
										<SelectItem value="event-3">
											Shakira - Las Mujeres Ya No Lloran
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="aspect-square rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center">
								<div className="text-center space-y-2 p-4">
									<Camera className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										Cámara QR activada
									</p>
									<p className="text-xs text-muted-foreground">
										Coloca el código QR frente a la cámara
									</p>
								</div>
							</div>

							{scanResult && (
								<Alert
									variant={
										scanResult.status === "success" ? "default" : "destructive"
									}
								>
									{scanResult.status === "success" && (
										<CheckCircle className="h-4 w-4" />
									)}
									{scanResult.status === "error" && (
										<XCircle className="h-4 w-4" />
									)}
									{scanResult.status === "duplicate" && (
										<AlertCircle className="h-4 w-4" />
									)}
									<AlertDescription>{scanResult.message}</AlertDescription>
								</Alert>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Entrada manual</CardTitle>
							<CardDescription>
								Introduce el código del boleto manualmente
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="ticket-code">Código de boleto</Label>
								<Input
									id="ticket-code"
									placeholder="TKT-2025-XXXXX"
									className="font-mono"
								/>
							</div>
							<Button onClick={handleManualScan} className="w-full">
								Validar boleto
							</Button>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Estadísticas de escaneo</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
									<div className="flex items-center gap-2 text-green-600 mb-1">
										<CheckCircle className="h-4 w-4" />
										<span className="text-sm font-medium">Válidos</span>
									</div>
									<p className="text-xl md:text-2xl font-bold">2,847</p>
								</div>

								<div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
									<div className="flex items-center gap-2 text-red-600 mb-1">
										<XCircle className="h-4 w-4" />
										<span className="text-sm font-medium">Rechazados</span>
									</div>
									<p className="text-xl md:text-2xl font-bold">12</p>
								</div>
							</div>

							<div className="p-4 rounded-lg border">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-muted-foreground">
										Capacidad utilizada
									</span>
									<span className="text-sm font-medium">85.2%</span>
								</div>
								<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
									<div
										className="h-full bg-primary"
										style={{ width: "85.2%" }}
									/>
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									2,847 de 3,500 boletos
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Últimos escaneos</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{[
									{
										name: "Carlos R.",
										section: "VIP",
										time: "Hace 2 min",
										status: "success",
									},
									{
										name: "Ana M.",
										section: "General",
										time: "Hace 3 min",
										status: "success",
									},
									{
										name: "Miguel H.",
										section: "Palco A",
										time: "Hace 5 min",
										status: "success",
									},
									{
										name: "Laura S.",
										section: "VIP",
										time: "Hace 7 min",
										status: "error",
									},
									{
										name: "Pedro M.",
										section: "General",
										time: "Hace 8 min",
										status: "success",
									},
								].map((scan, i) => (
									<div
										key={i}
										className="flex items-center justify-between p-3 rounded-lg border gap-2"
									>
										<div className="flex items-center gap-3 min-w-0">
											{scan.status === "success" ? (
												<CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
											) : (
												<XCircle className="h-5 w-5 text-red-600 shrink-0" />
											)}
											<div className="min-w-0">
												<p className="font-medium text-sm truncate">
													{scan.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{scan.section}
												</p>
											</div>
										</div>
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{scan.time}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
