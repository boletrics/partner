"use client";

import { useEffect, useMemo, useState } from "react";
import {
	MoreHorizontal,
	UserPlus,
	Mail,
	Shield,
	UserX,
	Search,
	Clock,
	RefreshCw,
	XCircle,
	Send,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	useOrgStore,
	type OrganizationMember,
	type OrganizationRole,
	type OrganizationInvitation,
} from "@/lib/org-store";
import {
	listMembers,
	inviteMember,
	listInvitations,
	cancelInvitation,
	resendInvitation,
} from "@/lib/auth/organizations";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const roleLabels: Record<OrganizationRole, string> = {
	owner: "Propietario",
	admin: "Administrador",
	manager: "Gerente",
	member: "Miembro",
	staff: "Personal",
	readonly: "Solo lectura",
};

const roleColors: Record<OrganizationRole, string> = {
	owner: "bg-amber-500/10 text-amber-600 border-amber-500/20",
	admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
	manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
	member: "bg-blue-500/10 text-blue-600 border-blue-500/20",
	staff: "bg-green-500/10 text-green-600 border-green-500/20",
	readonly: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export function OrgTeamTable() {
	const { toast } = useToast();
	const { currentOrg, members, setMembers } = useOrgStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(false);
	const [isInviting, setIsInviting] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<OrganizationRole>("member");
	const [openInvite, setOpenInvite] = useState(false);

	// Invitations state
	const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
	const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
	const [invitationsOpen, setInvitationsOpen] = useState(true);
	const [processingInvitationId, setProcessingInvitationId] = useState<
		string | null
	>(null);

	useEffect(() => {
		let cancelled = false;
		async function loadMembers() {
			if (!currentOrg) return;
			setIsLoading(true);
			const result = await listMembers(currentOrg.id);
			if (cancelled) return;
			if (result.data) {
				setMembers(result.data);
			} else if (result.error) {
				toast({
					variant: "destructive",
					title: "No se pudieron cargar los miembros",
					description: result.error,
				});
			}
			setIsLoading(false);
		}
		loadMembers();
		return () => {
			cancelled = true;
		};
	}, [currentOrg?.id, setMembers, toast]);

	// Load pending invitations
	useEffect(() => {
		let cancelled = false;
		async function loadInvitations() {
			if (!currentOrg) return;
			setIsLoadingInvitations(true);
			const result = await listInvitations(currentOrg.id, "pending");
			if (cancelled) return;
			if (result.data) {
				setInvitations(result.data);
			}
			setIsLoadingInvitations(false);
		}
		loadInvitations();
		return () => {
			cancelled = true;
		};
	}, [currentOrg?.id]);

	const filteredMembers = useMemo(() => {
		const currentMembers = members.filter(
			(member) => member.organizationId === currentOrg?.id,
		);

		return currentMembers.filter((member) => {
			const nameMatch = (member.name || member.email || member.userId || "")
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === "all" || member.role === roleFilter;
			return nameMatch && matchesRole;
		});
	}, [currentOrg?.id, members, roleFilter, searchQuery]);

	const formatDate = (dateString?: string) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleDateString("es-MX", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const formatDateTime = (dateString?: string) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleDateString("es-MX", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const isExpired = (expiresAt: string) => {
		return new Date(expiresAt) < new Date();
	};

	const handleInvite = async () => {
		if (!currentOrg || !inviteEmail) return;
		setIsInviting(true);
		const result = await inviteMember({
			email: inviteEmail,
			role: inviteRole,
			organizationId: currentOrg.id,
		});

		if (result.error) {
			toast({
				variant: "destructive",
				title: "No se pudo enviar la invitación",
				description: result.error,
			});
		} else {
			toast({
				title: "Invitación enviada",
				description: `${inviteEmail} fue invitado como ${roleLabels[inviteRole]}.`,
			});
			// Refresh invitations list
			const invResult = await listInvitations(currentOrg.id, "pending");
			if (invResult.data) {
				setInvitations(invResult.data);
			}
			setInviteEmail("");
			setInviteRole("member");
			setOpenInvite(false);
		}
		setIsInviting(false);
	};

	const handleCancelInvitation = async (invitation: OrganizationInvitation) => {
		if (!currentOrg) return;
		setProcessingInvitationId(invitation.id);

		const result = await cancelInvitation(invitation.id);
		if (result.error) {
			toast({
				variant: "destructive",
				title: "No se pudo cancelar la invitación",
				description: result.error,
			});
		} else {
			toast({
				title: "Invitación cancelada",
				description: `La invitación a ${invitation.email} ha sido cancelada.`,
			});
			setInvitations((prev) => prev.filter((i) => i.id !== invitation.id));
		}
		setProcessingInvitationId(null);
	};

	const handleResendInvitation = async (invitation: OrganizationInvitation) => {
		if (!currentOrg) return;
		setProcessingInvitationId(invitation.id);

		const result = await resendInvitation({
			email: invitation.email,
			role: invitation.role,
			organizationId: currentOrg.id,
		});

		if (result.error) {
			toast({
				variant: "destructive",
				title: "No se pudo reenviar la invitación",
				description: result.error,
			});
		} else {
			toast({
				title: "Invitación reenviada",
				description: `Se envió nuevamente la invitación a ${invitation.email}.`,
			});
			// Refresh invitations to get updated expiration
			const invResult = await listInvitations(currentOrg.id, "pending");
			if (invResult.data) {
				setInvitations(invResult.data);
			}
		}
		setProcessingInvitationId(null);
	};

	if (!currentOrg) {
		return null;
	}

	const pendingCount = invitations.length;

	return (
		<div className="space-y-6">
			{/* Pending Invitations Section */}
			{pendingCount > 0 && (
				<Card>
					<Collapsible open={invitationsOpen} onOpenChange={setInvitationsOpen}>
						<CardHeader className="pb-3">
							<CollapsibleTrigger asChild>
								<div className="flex items-center justify-between cursor-pointer group">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
											<Clock className="h-5 w-5 text-amber-600" />
										</div>
										<div>
											<CardTitle className="text-base">
												Invitaciones Pendientes
											</CardTitle>
											<CardDescription>
												{pendingCount}{" "}
												{pendingCount === 1
													? "invitación esperando respuesta"
													: "invitaciones esperando respuesta"}
											</CardDescription>
										</div>
									</div>
									<ChevronDown
										className={`h-5 w-5 text-muted-foreground transition-transform ${
											invitationsOpen ? "rotate-180" : ""
										}`}
									/>
								</div>
							</CollapsibleTrigger>
						</CardHeader>
						<CollapsibleContent>
							<CardContent className="pt-0">
								<div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
									<div className="rounded-md border min-w-[500px]">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Correo electrónico</TableHead>
													<TableHead>Rol</TableHead>
													<TableHead>Enviada</TableHead>
													<TableHead>Expira</TableHead>
													<TableHead className="w-[100px]"></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{isLoadingInvitations && (
													<TableRow>
														<TableCell
															colSpan={5}
															className="text-center text-muted-foreground"
														>
															Cargando invitaciones...
														</TableCell>
													</TableRow>
												)}
												{!isLoadingInvitations &&
													invitations.map((invitation) => (
														<TableRow key={invitation.id}>
															<TableCell>
																<div className="flex items-center gap-3">
																	<Avatar className="h-8 w-8 shrink-0">
																		<AvatarFallback className="text-xs">
																			{invitation.email
																				.split("@")[0]
																				.slice(0, 2)
																				.toUpperCase()}
																		</AvatarFallback>
																	</Avatar>
																	<div className="min-w-0">
																		<p className="font-medium truncate text-sm">
																			{invitation.email}
																		</p>
																		{invitation.inviterName && (
																			<p className="text-xs text-muted-foreground">
																				Invitado por {invitation.inviterName}
																			</p>
																		)}
																	</div>
																</div>
															</TableCell>
															<TableCell>
																<Badge
																	variant="outline"
																	className={
																		roleColors[invitation.role] ||
																		roleColors.member
																	}
																>
																	{roleLabels[invitation.role] ||
																		invitation.role}
																</Badge>
															</TableCell>
															<TableCell className="text-muted-foreground text-sm whitespace-nowrap">
																{formatDateTime(invitation.createdAt)}
															</TableCell>
															<TableCell>
																{isExpired(invitation.expiresAt) ? (
																	<Badge
																		variant="destructive"
																		className="text-xs"
																	>
																		Expirada
																	</Badge>
																) : (
																	<span className="text-muted-foreground text-sm whitespace-nowrap">
																		{formatDateTime(invitation.expiresAt)}
																	</span>
																)}
															</TableCell>
															<TableCell>
																<div className="flex items-center gap-1">
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8"
																		onClick={() =>
																			handleResendInvitation(invitation)
																		}
																		disabled={
																			processingInvitationId === invitation.id
																		}
																		title="Reenviar invitación"
																	>
																		{processingInvitationId ===
																		invitation.id ? (
																			<RefreshCw className="h-4 w-4 animate-spin" />
																		) : (
																			<Send className="h-4 w-4" />
																		)}
																	</Button>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8 text-destructive hover:text-destructive"
																		onClick={() =>
																			handleCancelInvitation(invitation)
																		}
																		disabled={
																			processingInvitationId === invitation.id
																		}
																		title="Cancelar invitación"
																	>
																		<XCircle className="h-4 w-4" />
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</div>
							</CardContent>
						</CollapsibleContent>
					</Collapsible>
				</Card>
			)}

			{/* Team Members Section */}
			<Card className="overflow-hidden">
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="min-w-0">
							<CardTitle>Miembros del Equipo</CardTitle>
							<CardDescription>
								Gestiona los accesos y permisos de tu organización
							</CardDescription>
						</div>
						<Dialog open={openInvite} onOpenChange={setOpenInvite}>
							<DialogTrigger asChild>
								<Button className="gap-2">
									<UserPlus className="h-4 w-4" />
									Invitar miembro
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Invitar miembro</DialogTitle>
									<DialogDescription>
										Envía una invitación por correo para que se una a la
										organización.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="invite-email">Correo electrónico</Label>
										<Input
											id="invite-email"
											type="email"
											required
											value={inviteEmail}
											onChange={(e) => setInviteEmail(e.target.value)}
											placeholder="persona@empresa.com"
										/>
									</div>
									<div className="space-y-2">
										<Label>Rol</Label>
										<Select
											value={inviteRole}
											onValueChange={(value) =>
												setInviteRole(value as OrganizationRole)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona un rol" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="owner">Propietario</SelectItem>
												<SelectItem value="admin">Administrador</SelectItem>
												<SelectItem value="manager">Gerente</SelectItem>
												<SelectItem value="member">Miembro</SelectItem>
												<SelectItem value="staff">Personal</SelectItem>
												<SelectItem value="readonly">Solo lectura</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												setInviteEmail("");
												setInviteRole("member");
											}}
										>
											Cancelar
										</Button>
									</DialogClose>
									<Button
										type="button"
										onClick={handleInvite}
										disabled={isInviting || !inviteEmail}
									>
										{isInviting ? "Enviando..." : "Enviar invitación"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar por nombre o email..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filtrar por rol" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los roles</SelectItem>
								<SelectItem value="owner">Propietario</SelectItem>
								<SelectItem value="admin">Administrador</SelectItem>
								<SelectItem value="manager">Gerente</SelectItem>
								<SelectItem value="member">Miembro</SelectItem>
								<SelectItem value="staff">Personal</SelectItem>
								<SelectItem value="readonly">Solo lectura</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
						<div className="rounded-md border min-w-[600px]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Miembro</TableHead>
										<TableHead>Rol</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead>Fecha de ingreso</TableHead>
										<TableHead className="w-[50px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading && (
										<TableRow>
											<TableCell
												colSpan={5}
												className="text-center text-muted-foreground"
											>
												Cargando miembros...
											</TableCell>
										</TableRow>
									)}
									{!isLoading &&
										filteredMembers.map((member) => (
											<TableRow key={member.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="h-9 w-9 shrink-0">
															<AvatarImage
																src={member.avatar || "/placeholder.svg"}
																alt={
																	member.name ?? member.email ?? member.userId
																}
															/>
															<AvatarFallback>
																{(member.name || member.email || "??")
																	.split(" ")
																	.map((n) => n[0])
																	.join("")
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className="min-w-0">
															<p className="font-medium truncate">
																{member.name || member.email || member.userId}
															</p>
															<p className="text-sm text-muted-foreground truncate">
																{member.email || "Correo no disponible"}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={
															roleColors[member.role] || roleColors.member
														}
													>
														{roleLabels[member.role] || member.role}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															member.status === "active"
																? "default"
																: "secondary"
														}
													>
														{member.status === "active"
															? "Activo"
															: "Pendiente"}
													</Badge>
												</TableCell>
												<TableCell className="text-muted-foreground whitespace-nowrap">
													{formatDate(member.joinedAt || member.invitedAt)}
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
															<DropdownMenuItem>
																<Mail className="mr-2 h-4 w-4" />
																Enviar mensaje
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Shield className="mr-2 h-4 w-4" />
																Cambiar rol
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
																<UserX className="mr-2 h-4 w-4" />
																Remover del equipo
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</div>
					</div>

					{!isLoading && filteredMembers.length === 0 && (
						<div className="text-center py-8 text-muted-foreground">
							No se encontraron miembros con los filtros seleccionados
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
