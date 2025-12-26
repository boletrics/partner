"use client";

import { useState, useEffect } from "react";
import {
	QrCode,
	CheckCircle,
	XCircle,
	AlertCircle,
	Camera,
	Loader2,
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
import { useOrganizationEvents } from "@/lib/api/hooks";
import { useOrgStore } from "@/lib/org-store";

interface ScanStats {
	valid: number;
	rejected: number;
	capacity: number;
	scanned: number;
}

interface RecentScan {
	name: string;
	section: string;
	time: string;
	status: "success" | "error";
}

interface TicketValidationResult {
	valid: boolean;
	ticketType?: string;
	holderName?: string;
	seat?: string;
	section?: string;
	error?: string;
	alreadyScanned?: boolean;
	scannedAt?: string;
}

export function ScanView() {
	const { currentOrg } = useOrgStore();
	const { data: eventsData } = useOrganizationEvents();
	const events = eventsData?.data || [];
	const [selectedEventId, setSelectedEventId] = useState<string>("");
	const [ticketCode, setTicketCode] = useState("");
	const [isValidating, setIsValidating] = useState(false);
	const [scanResult, setScanResult] = useState<{
		status: "success" | "error" | "duplicate";
		message: string;
	} | null>(null);
	const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
	const [scanStats, setScanStats] = useState<ScanStats>({
		valid: 0,
		rejected: 0,
		capacity: 0,
		scanned: 0,
	});

	// Update capacity when event is selected
	useEffect(() => {
		const selectedEvent = events.find((e) => e.id === selectedEventId);
		if (selectedEvent?.venue?.capacity) {
			setScanStats((prev) => ({
				...prev,
				capacity: selectedEvent.venue!.capacity!,
			}));
		}
	}, [selectedEventId, events]);

	const handleManualScan = async () => {
		if (!ticketCode.trim() || !selectedEventId) {
			setScanResult({
				status: "error",
				message: "Por favor ingresa un código de boleto y selecciona un evento",
			});
			setTimeout(() => setScanResult(null), 5000);
			return;
		}

		setIsValidating(true);
		try {
			const response = await fetch("/api/tickets/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					ticketCode: ticketCode.trim(),
					eventId: selectedEventId,
				}),
			});

			const result = (await response.json()) as TicketValidationResult;

			if (response.ok && result.valid) {
				setScanResult({
					status: "success",
					message: `Boleto válido - ${result.ticketType} - ${result.holderName}`,
				});
				setScanStats((prev) => ({
					...prev,
					valid: prev.valid + 1,
					scanned: prev.scanned + 1,
				}));
				setRecentScans((prev) => [
					{
						name: result.holderName || "Anónimo",
						section: result.ticketType || "General",
						time: "Ahora",
						status: "success",
					},
					...prev.slice(0, 4),
				]);
			} else if (result.alreadyScanned) {
				setScanResult({
					status: "duplicate",
					message: `Este boleto ya fue escaneado ${result.scannedAt || "anteriormente"}`,
				});
			} else {
				setScanResult({
					status: "error",
					message: result.error || "Boleto inválido o no encontrado",
				});
				setScanStats((prev) => ({
					...prev,
					rejected: prev.rejected + 1,
				}));
				setRecentScans((prev) => [
					{
						name: "Desconocido",
						section: "N/A",
						time: "Ahora",
						status: "error",
					},
					...prev.slice(0, 4),
				]);
			}
		} catch {
			setScanResult({
				status: "error",
				message: "Error de conexión. Intenta de nuevo.",
			});
		} finally {
			setIsValidating(false);
			setTicketCode("");
			setTimeout(() => setScanResult(null), 5000);
		}
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
								<Select
									value={selectedEventId}
									onValueChange={setSelectedEventId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona un evento" />
									</SelectTrigger>
									<SelectContent>
										{events.map((event) => (
											<SelectItem key={event.id} value={event.id}>
												{event.title}
											</SelectItem>
										))}
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
									value={ticketCode}
									onChange={(e) => setTicketCode(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleManualScan();
									}}
								/>
							</div>
							<Button
								onClick={handleManualScan}
								className="w-full"
								disabled={isValidating || !selectedEventId}
							>
								{isValidating && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
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
									<p className="text-xl md:text-2xl font-bold">
										{scanStats.valid.toLocaleString()}
									</p>
								</div>

								<div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
									<div className="flex items-center gap-2 text-red-600 mb-1">
										<XCircle className="h-4 w-4" />
										<span className="text-sm font-medium">Rechazados</span>
									</div>
									<p className="text-xl md:text-2xl font-bold">
										{scanStats.rejected}
									</p>
								</div>
							</div>

							<div className="p-4 rounded-lg border">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-muted-foreground">
										Capacidad utilizada
									</span>
									<span className="text-sm font-medium">
										{scanStats.capacity > 0
											? `${((scanStats.scanned / scanStats.capacity) * 100).toFixed(1)}%`
											: "0%"}
									</span>
								</div>
								<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
									<div
										className="h-full bg-primary"
										style={{
											width:
												scanStats.capacity > 0
													? `${Math.min((scanStats.scanned / scanStats.capacity) * 100, 100)}%`
													: "0%",
										}}
									/>
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{scanStats.scanned.toLocaleString()} de{" "}
									{scanStats.capacity.toLocaleString()} boletos
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Últimos escaneos</CardTitle>
						</CardHeader>
						<CardContent>
							{recentScans.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-8">
									No hay escaneos recientes. Comienza validando un boleto.
								</p>
							) : (
								<div className="space-y-3">
									{recentScans.map((scan, i) => (
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
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
