"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	CheckCircle,
	XCircle,
	Loader2,
	AlertCircle,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { acceptInvitation } from "@/lib/auth/organizations";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { useToast } from "@/components/ui/use-toast";

type InvitationState =
	| "loading"
	| "ready"
	| "accepting"
	| "accepted"
	| "error"
	| "not-authenticated";

export default function AcceptInvitationPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();
	const { data: session, isPending: sessionLoading } = useAuthSession();

	const invitationId = searchParams.get("invitationId");
	const [state, setState] = useState<InvitationState>("loading");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		if (sessionLoading) return;

		if (!session?.user) {
			setState("not-authenticated");
			return;
		}

		if (!invitationId) {
			setState("error");
			setErrorMessage("No se proporcionó un ID de invitación válido.");
			return;
		}

		setState("ready");
	}, [session, sessionLoading, invitationId]);

	const handleAccept = async () => {
		if (!invitationId) return;

		setState("accepting");
		const result = await acceptInvitation(invitationId);

		if (result.error) {
			setState("error");
			setErrorMessage(result.error);
			toast({
				variant: "destructive",
				title: "Error al aceptar la invitación",
				description: result.error,
			});
		} else {
			setState("accepted");
			toast({
				title: "¡Invitación aceptada!",
				description: "Ahora eres parte de la organización.",
			});
			// Redirect to main page after a short delay
			setTimeout(() => {
				router.push("/");
			}, 2000);
		}
	};

	const handleDecline = () => {
		// For now, just redirect back to home
		// In the future, we could add a reject-invitation API
		router.push("/");
	};

	const handleLogin = () => {
		const authAppUrl =
			process.env.NEXT_PUBLIC_AUTH_APP_URL ||
			"https://auth.boletrics.workers.dev";
		const currentUrl = window.location.href;
		window.location.href = `${authAppUrl}/login?redirect_to=${encodeURIComponent(currentUrl)}`;
	};

	if (state === "loading" || sessionLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
				<Card className="w-full max-w-md">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
						<p className="text-muted-foreground">Verificando invitación...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (state === "not-authenticated") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
							<Users className="h-8 w-8 text-amber-600" />
						</div>
						<CardTitle className="text-2xl">
							Invitación de Organización
						</CardTitle>
						<CardDescription>
							Tienes una invitación pendiente para unirte a una organización.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-muted-foreground mb-4">
							Para aceptar esta invitación, primero debes iniciar sesión o crear
							una cuenta.
						</p>
					</CardContent>
					<CardFooter className="flex flex-col gap-3">
						<Button onClick={handleLogin} className="w-full" size="lg">
							Iniciar sesión
						</Button>
						<p className="text-xs text-muted-foreground text-center">
							Serás redirigido de vuelta después de iniciar sesión
						</p>
					</CardFooter>
				</Card>
			</div>
		);
	}

	if (state === "accepted") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl">¡Bienvenido al equipo!</CardTitle>
						<CardDescription>
							Has aceptado la invitación exitosamente.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-muted-foreground">
							Serás redirigido al panel de la organización en unos segundos...
						</p>
					</CardContent>
					<CardFooter>
						<Button onClick={() => router.push("/")} className="w-full">
							Ir al panel
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	if (state === "error") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
							<AlertCircle className="h-8 w-8 text-destructive" />
						</div>
						<CardTitle className="text-2xl">Error</CardTitle>
						<CardDescription>
							No se pudo procesar la invitación.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-muted-foreground">
							{errorMessage ||
								"La invitación puede haber expirado o ya fue utilizada."}
						</p>
					</CardContent>
					<CardFooter className="flex gap-3">
						<Button
							variant="outline"
							onClick={() => router.push("/")}
							className="flex-1"
						>
							Volver al inicio
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	// state === "ready" or "accepting"
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<Users className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-2xl">Invitación de Organización</CardTitle>
					<CardDescription>
						Has sido invitado a unirte a una organización en Boletrics.
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-muted-foreground mb-2">
						¿Deseas aceptar esta invitación y unirte al equipo?
					</p>
					<p className="text-xs text-muted-foreground">
						Conectado como:{" "}
						<span className="font-medium">{session?.user?.email}</span>
					</p>
				</CardContent>
				<CardFooter className="flex gap-3">
					<Button
						variant="outline"
						onClick={handleDecline}
						className="flex-1"
						disabled={state === "accepting"}
					>
						Rechazar
					</Button>
					<Button
						onClick={handleAccept}
						className="flex-1"
						disabled={state === "accepting"}
					>
						{state === "accepting" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Aceptando...
							</>
						) : (
							"Aceptar invitación"
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
