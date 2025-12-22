"use client";

import { useEffect, useMemo, useState } from "react";
import {
	MoreHorizontal,
	UserPlus,
	Mail,
	Shield,
	UserX,
	Search,
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
} from "@/lib/org-store";
import { listMembers, inviteMember } from "@/lib/auth/organizations";
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
			// Refresh members to reflect pending invitations if the API returns them
			const reload = await listMembers(currentOrg.id);
			if (reload.data) {
				setMembers(reload.data);
			}
			setInviteEmail("");
			setInviteRole("member");
			setOpenInvite(false);
		}
		setIsInviting(false);
	};

	if (!currentOrg) {
		return null;
	}

	return (
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
															alt={member.name ?? member.email ?? member.userId}
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
														member.status === "active" ? "default" : "secondary"
													}
												>
													{member.status === "active" ? "Activo" : "Pendiente"}
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
	);
}
