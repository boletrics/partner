"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
	LayoutDashboard,
	Calendar,
	Ticket,
	Users,
	BarChart3,
	Wallet,
	Settings,
	Building2,
	HelpCircle,
	ChevronDown,
	Plus,
	ChevronsUpDown,
	LogOut,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrgStore } from "@/lib/org-store";
import { usePathname, useRouter } from "next/navigation";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { logout } from "@/lib/auth/actions";
import {
	createOrganization,
	setActiveOrganization,
} from "@/lib/auth/organizations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type React from "react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type NavItem = {
	title: string;
	href?: string;
	icon: LucideIcon;
	items?: { title: string; href: string }[];
};

const mainNavItems: NavItem[] = [
	{
		title: "Panel Principal",
		href: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Eventos",
		icon: Calendar,
		items: [
			{ title: "Todos los eventos", href: "/events" },
			{ title: "Crear evento", href: "/events/new" },
			{ title: "Borradores", href: "/events/drafts" },
		],
	},
	{
		title: "Boletos",
		icon: Ticket,
		items: [
			{ title: "Órdenes", href: "/orders" },
			{ title: "Escaneo", href: "/scan" },
			{ title: "Reembolsos", href: "/refunds" },
		],
	},
	{
		title: "Clientes",
		href: "/customers",
		icon: Users,
	},
];

const businessNavItems: NavItem[] = [
	{
		title: "Analíticas",
		href: "/analytics",
		icon: BarChart3,
	},
	{
		title: "Finanzas",
		icon: Wallet,
		items: [
			{ title: "Resumen", href: "/finance" },
			{ title: "Transacciones", href: "/finance/transactions" },
			{ title: "Retiros", href: "/finance/payouts" },
		],
	},
	{
		title: "Equipo",
		href: "/team",
		icon: Users,
	},
	{
		title: "Configuración",
		href: "/settings",
		icon: Settings,
	},
];

const secondaryNavItems: NavItem[] = [
	{
		title: "Centro de ayuda",
		href: "/help",
		icon: HelpCircle,
	},
];

function OrgSwitcher() {
	const { toast } = useToast();
	const { currentOrg, organizations, setCurrentOrg, addOrganization } =
		useOrgStore();
	const [isSwitching, setIsSwitching] = useState(false);
	const activeOrgs = organizations.filter((org) => org.status === "active");

	const getOrgInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	};

	const handleSwitch = async (orgId: string) => {
		if (isSwitching) return;
		setIsSwitching(true);
		const org = organizations.find((o) => o.id === orgId);
		const result = await setActiveOrganization(orgId);

		if (result.error || !org) {
			toast({
				variant: "destructive",
				title: "No se pudo cambiar de organización",
				description: result.error ?? "Intenta de nuevo.",
			});
		} else {
			setCurrentOrg(org);
			toast({
				title: "Organización activa actualizada",
				description: `${org.name} ahora es tu organización activa.`,
			});
		}
		setIsSwitching(false);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage
							src={currentOrg?.logo || "/placeholder.svg"}
							alt={currentOrg?.name || "Organización"}
						/>
						<AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
							{currentOrg ? getOrgInitials(currentOrg.name) : "?"}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{currentOrg?.name || "Seleccionar"}
						</span>
						<span className="truncate text-xs text-muted-foreground capitalize">
							{currentOrg?.plan ? `Plan ${currentOrg.plan}` : "Sin plan"}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side="bottom"
				align="start"
				sideOffset={4}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Mis Organizaciones
				</DropdownMenuLabel>
				{activeOrgs.map((org) => (
					<DropdownMenuItem
						key={org.id}
						onClick={() => handleSwitch(org.id)}
						className="gap-2 p-2"
						disabled={isSwitching}
					>
						<Avatar className="h-6 w-6 rounded-md">
							<AvatarImage
								src={org.logo || "/placeholder.svg"}
								alt={org.name}
							/>
							<AvatarFallback className="rounded-md bg-primary/10 text-xs">
								{getOrgInitials(org.name)}
							</AvatarFallback>
						</Avatar>
						<span className="flex-1 truncate">{org.name}</span>
						{org.id === currentOrg?.id && (
							<span className="h-2 w-2 rounded-full bg-primary" />
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<CreateOrganizationDialog
					trigger={
						<DropdownMenuItem
							className="gap-2 p-2"
							onSelect={(e) => e.preventDefault()}
						>
							<div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
								<Plus className="h-4 w-4" />
							</div>
							<span className="font-medium">Nueva organización</span>
						</DropdownMenuItem>
					}
					onCreated={(org) => {
						if (!org) return;
						addOrganization(org);
						setCurrentOrg(org);
					}}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function NavMain({ items }: { items: NavItem[] }) {
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	const isGroupActive = (item: NavItem) => {
		if (item.href) return isActive(item.href);
		return item.items?.some((sub) => isActive(sub.href)) ?? false;
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Gestión</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) =>
						item.items ? (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={isGroupActive(item)}
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
											<ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														asChild
														isActive={isActive(subItem.href)}
													>
														<Link href={subItem.href}>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						) : (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={isActive(item.href!)}
								>
									<Link href={item.href!}>
										<item.icon className="h-4 w-4" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						),
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavBusiness({ items }: { items: NavItem[] }) {
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	const isGroupActive = (item: NavItem) => {
		if (item.href) return isActive(item.href);
		return item.items?.some((sub) => isActive(sub.href)) ?? false;
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Negocio</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) =>
						item.items ? (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={isGroupActive(item)}
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
											<ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														asChild
														isActive={isActive(subItem.href)}
													>
														<Link href={subItem.href}>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						) : (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={isActive(item.href!)}
								>
									<Link href={item.href!}>
										<item.icon className="h-4 w-4" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						),
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavSecondary({ items }: { items: NavItem[] }) {
	const pathname = usePathname();

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<SidebarGroup className="mt-auto">
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								size="sm"
								isActive={isActive(item.href!)}
							>
								<Link href={item.href!}>
									<item.icon className="h-4 w-4" />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavUser() {
	const router = useRouter();
	const { data: session, isPending } = useAuthSession();
	const { error } = useOrgStore();

	const getUserInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	};

	const handleLogout = async () => {
		await logout();
	};

	const userName = isPending ? "Cargando..." : session?.user?.name || "Usuario";
	const userEmail = isPending
		? "..."
		: session?.user?.email || "usuario@ejemplo.com";
	const userImage = session?.user?.image || null;
	const initials = session?.user?.name
		? getUserInitials(session.user.name)
		: "U";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={userImage || undefined} alt={userName} />
								<AvatarFallback className="rounded-lg">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{userName}</span>
								<span className="truncate text-xs text-muted-foreground">
									{userEmail}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side="bottom"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={userImage || undefined} alt={userName} />
									<AvatarFallback className="rounded-lg">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{userName}</span>
									<span className="truncate text-xs text-muted-foreground">
										{error ? "Sesión limitada" : userEmail}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Building2 className="mr-2 h-4 w-4" />
							Ver tienda pública
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push("/settings")}>
							<Settings className="mr-2 h-4 w-4" />
							Mi perfil
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive cursor-pointer"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Cerrar sesión
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export function OrgSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<OrgSwitcher />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={mainNavItems} />
				<NavBusiness items={businessNavItems} />
				<NavSecondary items={secondaryNavItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function CreateOrganizationDialog({
	trigger,
	onCreated,
}: {
	trigger: React.ReactNode;
	onCreated: (
		org: Awaited<ReturnType<typeof createOrganization>>["data"],
	) => void;
}) {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [logo, setLogo] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const derivedSlug = useMemo(
		() => (slug ? slugify(slug) : slugify(name)),
		[name, slug],
	);

	const resetForm = () => {
		setName("");
		setSlug("");
		setLogo("");
		setError(null);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		setError(null);

		const result = await createOrganization({
			name,
			slug: derivedSlug,
			logo: logo || undefined,
		});

		if (result.error || !result.data) {
			setError(result.error || "Intenta nuevamente más tarde.");
		} else {
			onCreated(result.data);
			toast({
				title: "Organización creada",
				description: `${result.data.name} ha sido creada.`,
			});
			setOpen(false);
			resetForm();
		}

		setIsSubmitting(false);
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			resetForm();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nueva organización</DialogTitle>
					<DialogDescription>
						Crea una organización para gestionar tus eventos y equipo.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
							{error}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="org-name">Nombre</Label>
						<Input
							id="org-name"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setError(null);
							}}
							required
							placeholder="Mi organización"
						/>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="org-slug">Slug</Label>
							<span className="text-xs text-muted-foreground">
								Se usará en la URL
							</span>
						</div>
						<Input
							id="org-slug"
							value={slug}
							onChange={(e) => {
								setSlug(e.target.value);
								setError(null);
							}}
							placeholder="mi-organizacion"
						/>
						<p className="text-xs text-muted-foreground">
							Slug final:{" "}
							<span className="font-medium">{derivedSlug || "..."}</span>
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="org-logo">Logo (URL opcional)</Label>
						<Input
							id="org-logo"
							value={logo}
							onChange={(e) => setLogo(e.target.value)}
							placeholder="https://example.com/logo.png"
						/>
					</div>
					<Separator />
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting || !name}>
							{isSubmitting ? "Creando..." : "Crear organización"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
