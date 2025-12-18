"use client";

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
import {
	useNavigationStore,
	type NavigationView,
} from "@/lib/navigation-store";
import { usePathname } from "next/navigation";

const mainNavItems = [
	{
		title: "Panel Principal",
		view: "dashboard" as NavigationView,
		icon: LayoutDashboard,
	},
	{
		title: "Eventos",
		icon: Calendar,
		items: [
			{ title: "Todos los eventos", view: "events" as NavigationView },
			{ title: "Crear evento", view: "events-new" as NavigationView },
			{ title: "Borradores", view: "events-drafts" as NavigationView },
		],
	},
	{
		title: "Boletos",
		icon: Ticket,
		items: [
			{ title: "Órdenes", view: "orders" as NavigationView },
			{ title: "Escaneo", view: "scan" as NavigationView },
			{ title: "Reembolsos", view: "refunds" as NavigationView },
		],
	},
	{
		title: "Clientes",
		view: "customers" as NavigationView,
		icon: Users,
	},
];

const businessNavItems = [
	{
		title: "Analíticas",
		view: "analytics" as NavigationView,
		icon: BarChart3,
	},
	{
		title: "Finanzas",
		icon: Wallet,
		items: [
			{ title: "Resumen", view: "finance" as NavigationView },
			{
				title: "Transacciones",
				view: "finance-transactions" as NavigationView,
			},
			{ title: "Retiros", view: "finance-payouts" as NavigationView },
		],
	},
	{
		title: "Equipo",
		view: "team" as NavigationView,
		icon: Users,
	},
	{
		title: "Configuración",
		view: "settings" as NavigationView,
		icon: Settings,
	},
];

const secondaryNavItems = [
	{
		title: "Centro de ayuda",
		view: "help" as NavigationView,
		icon: HelpCircle,
	},
];

function OrgSwitcher() {
	const { currentOrg, organizations, setCurrentOrg } = useOrgStore();
	const activeOrgs = organizations.filter((org) => org.status === "active");

	const getOrgInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
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
							alt={currentOrg?.name}
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
							Plan {currentOrg?.plan}
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
						onClick={() => setCurrentOrg(org)}
						className="gap-2 p-2"
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
				<DropdownMenuItem className="gap-2 p-2">
					<div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
						<Plus className="h-4 w-4" />
					</div>
					<span className="font-medium">Nueva organización</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function NavMain({ items }: { items: typeof mainNavItems }) {
	const { currentView, setView } = useNavigationStore();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Gestión</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) =>
						item.items ? (
							<Collapsible key={item.title} asChild defaultOpen={false}>
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
														onClick={() => setView(subItem.view)}
														isActive={currentView === subItem.view}
													>
														<span>{subItem.title}</span>
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
									onClick={() => setView(item.view!)}
									tooltip={item.title}
									isActive={currentView === item.view}
								>
									<item.icon className="h-4 w-4" />
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						),
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavBusiness({ items }: { items: typeof businessNavItems }) {
	const { currentView, setView } = useNavigationStore();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Negocio</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) =>
						item.items ? (
							<Collapsible key={item.title} asChild defaultOpen={false}>
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
														onClick={() => setView(subItem.view)}
														isActive={currentView === subItem.view}
													>
														<span>{subItem.title}</span>
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
									onClick={() => setView(item.view!)}
									tooltip={item.title}
									isActive={currentView === item.view}
								>
									<item.icon className="h-4 w-4" />
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						),
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavSecondary({ items }: { items: typeof secondaryNavItems }) {
	const { setView } = useNavigationStore();

	return (
		<SidebarGroup className="mt-auto">
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton onClick={() => setView(item.view)} size="sm">
								<item.icon className="h-4 w-4" />
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavUser() {
	const { setView } = useNavigationStore();

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
								<AvatarImage src="/professional-avatar.png" alt="Usuario" />
								<AvatarFallback className="rounded-lg">MG</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">María García</span>
								<span className="truncate text-xs text-muted-foreground">
									maria@ocesa.com.mx
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
									<AvatarImage src="/professional-avatar.png" alt="Usuario" />
									<AvatarFallback className="rounded-lg">MG</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">María García</span>
									<span className="truncate text-xs text-muted-foreground">
										maria@ocesa.com.mx
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Building2 className="mr-2 h-4 w-4" />
							Ver tienda pública
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setView("settings")}>
							<Settings className="mr-2 h-4 w-4" />
							Mi perfil
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
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
	const pathname = usePathname();

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
