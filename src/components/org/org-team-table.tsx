"use client";

import { useState } from "react";
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
import type { OrganizationMember, OrganizationRole } from "@/lib/org-store";

interface TeamMember extends OrganizationMember {
	name: string;
	email: string;
	avatar?: string;
}

const mockTeamMembers: TeamMember[] = [
	{
		id: "member-1",
		userId: "user-1",
		organizationId: "org-1",
		role: "owner",
		permissions: [],
		status: "active",
		invitedAt: "2024-01-15T00:00:00Z",
		joinedAt: "2024-01-15T00:00:00Z",
		name: "María García",
		email: "maria@ocesa.com.mx",
		avatar: "/professional-woman-avatar.png",
	},
	{
		id: "member-2",
		userId: "user-2",
		organizationId: "org-1",
		role: "admin",
		permissions: [],
		status: "active",
		invitedAt: "2024-02-01T00:00:00Z",
		joinedAt: "2024-02-03T00:00:00Z",
		name: "Carlos Rodríguez",
		email: "carlos@ocesa.com.mx",
		avatar: "/professional-man-avatar.png",
	},
	{
		id: "member-3",
		userId: "user-3",
		organizationId: "org-1",
		role: "manager",
		permissions: [],
		status: "active",
		invitedAt: "2024-03-15T00:00:00Z",
		joinedAt: "2024-03-16T00:00:00Z",
		name: "Ana López",
		email: "ana@ocesa.com.mx",
		avatar: "/professional-woman-avatar-2.png",
	},
	{
		id: "member-4",
		userId: "user-4",
		organizationId: "org-1",
		role: "staff",
		permissions: [],
		status: "active",
		invitedAt: "2024-06-01T00:00:00Z",
		joinedAt: "2024-06-02T00:00:00Z",
		name: "Pedro Martínez",
		email: "pedro@ocesa.com.mx",
		avatar: "/professional-man-avatar-2.png",
	},
	{
		id: "member-5",
		userId: "user-5",
		organizationId: "org-1",
		role: "staff",
		permissions: [],
		status: "pending",
		invitedAt: "2025-01-10T00:00:00Z",
		name: "Laura Sánchez",
		email: "laura@ocesa.com.mx",
	},
];

const roleLabels: Record<OrganizationRole, string> = {
	owner: "Propietario",
	admin: "Administrador",
	manager: "Gerente",
	staff: "Personal",
	readonly: "Solo lectura",
};

const roleColors: Record<OrganizationRole, string> = {
	owner: "bg-amber-500/10 text-amber-600 border-amber-500/20",
	admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
	manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
	staff: "bg-green-500/10 text-green-600 border-green-500/20",
	readonly: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export function OrgTeamTable() {
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");

	const filteredMembers = mockTeamMembers.filter((member) => {
		const matchesSearch =
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole = roleFilter === "all" || member.role === roleFilter;
		return matchesSearch && matchesRole;
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-MX", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="min-w-0">
						<CardTitle>Miembros del Equipo</CardTitle>
						<CardDescription>
							Gestiona los accesos y permisos de tu equipo
						</CardDescription>
					</div>
					<Button className="gap-2">
						<UserPlus className="h-4 w-4" />
						Invitar miembro
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{/* Filters */}
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
								{filteredMembers.map((member) => (
									<TableRow key={member.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-9 w-9 shrink-0">
													<AvatarImage
														src={member.avatar || "/placeholder.svg"}
														alt={member.name}
													/>
													<AvatarFallback>
														{member.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0">
													<p className="font-medium truncate">{member.name}</p>
													<p className="text-sm text-muted-foreground truncate">
														{member.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={roleColors[member.role]}
											>
												{roleLabels[member.role]}
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
											{member.joinedAt ? formatDate(member.joinedAt) : "—"}
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

				{filteredMembers.length === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						No se encontraron miembros con los filtros seleccionados
					</div>
				)}
			</CardContent>
		</Card>
	);
}
