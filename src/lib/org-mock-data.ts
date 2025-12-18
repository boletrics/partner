import type { Organization, OrganizationMember } from "./org-store";
import { rolePermissions } from "./org-store";

// Mock Organizations for Mexican Market
export const mockOrganizations: Organization[] = [
	{
		id: "org-1",
		name: "OCESA Presents",
		slug: "ocesa-presents",
		logo: "/ocesa-logo-entertainment-company.jpg",
		description:
			"La promotora de entretenimiento líder en México y Latinoamérica",
		website: "https://ocesa.com.mx",
		email: "contacto@ocesa.com.mx",
		phone: "+52 55 5325 9000",
		address: {
			street: "Av. Insurgentes Sur 1457",
			city: "Ciudad de México",
			state: "CDMX",
			postalCode: "03920",
			country: "México",
		},
		taxId: "OCE850101ABC",
		status: "active",
		plan: "enterprise",
		settings: {
			currency: "MXN",
			timezone: "America/Mexico_City",
			language: "es",
			commissionRate: 8,
			payoutSchedule: "weekly",
			notificationPreferences: { email: true, sms: true, push: true },
			branding: { primaryColor: "#E31837", secondaryColor: "#1E3A8A" },
		},
		createdAt: "2024-01-15T00:00:00Z",
		updatedAt: "2025-01-10T00:00:00Z",
	},
	{
		id: "org-2",
		name: "Live Nation México",
		slug: "live-nation-mexico",
		logo: "/live-nation-mexico-logo.jpg",
		description: "Experiencias en vivo inolvidables",
		website: "https://livenation.com.mx",
		email: "info@livenation.com.mx",
		phone: "+52 55 1234 5678",
		address: {
			street: "Paseo de la Reforma 222",
			city: "Ciudad de México",
			state: "CDMX",
			postalCode: "06600",
			country: "México",
		},
		taxId: "LNM900501XYZ",
		status: "active",
		plan: "enterprise",
		settings: {
			currency: "MXN",
			timezone: "America/Mexico_City",
			language: "es",
			commissionRate: 10,
			payoutSchedule: "biweekly",
			notificationPreferences: { email: true, sms: false, push: true },
			branding: { primaryColor: "#FF0000" },
		},
		createdAt: "2024-03-20T00:00:00Z",
		updatedAt: "2025-01-08T00:00:00Z",
	},
	{
		id: "org-3",
		name: "Zignia Live",
		slug: "zignia-live",
		logo: "/zignia-live-entertainment-logo.jpg",
		description: "Productora de eventos deportivos y musicales",
		website: "https://zignia.mx",
		email: "eventos@zignia.mx",
		phone: "+52 81 8765 4321",
		address: {
			street: "Av. Vasconcelos 345",
			city: "Monterrey",
			state: "Nuevo León",
			postalCode: "66220",
			country: "México",
		},
		taxId: "ZIG920815DEF",
		status: "active",
		plan: "professional",
		settings: {
			currency: "MXN",
			timezone: "America/Monterrey",
			language: "es",
			commissionRate: 12,
			payoutSchedule: "weekly",
			notificationPreferences: { email: true, sms: true, push: false },
			branding: { primaryColor: "#7C3AED" },
		},
		createdAt: "2024-06-01T00:00:00Z",
		updatedAt: "2025-01-05T00:00:00Z",
	},
	{
		id: "org-4",
		name: "Teatro Diana Producciones",
		slug: "teatro-diana",
		logo: "/teatro-diana-theater-logo.jpg",
		description: "El teatro más emblemático de Guadalajara",
		website: "https://teatrodiana.com",
		email: "boletos@teatrodiana.com",
		phone: "+52 33 3615 1414",
		address: {
			street: "Av. 16 de Septiembre 710",
			city: "Guadalajara",
			state: "Jalisco",
			postalCode: "44100",
			country: "México",
		},
		taxId: "TDP880320GHI",
		status: "active",
		plan: "professional",
		settings: {
			currency: "MXN",
			timezone: "America/Mexico_City",
			language: "es",
			commissionRate: 15,
			payoutSchedule: "monthly",
			notificationPreferences: { email: true, sms: false, push: false },
			branding: { primaryColor: "#B91C1C", secondaryColor: "#FCD34D" },
		},
		createdAt: "2024-02-10T00:00:00Z",
		updatedAt: "2025-01-12T00:00:00Z",
	},
	{
		id: "org-5",
		name: "EDM México",
		slug: "edm-mexico",
		logo: "/edm-electronic-music-festival-logo.jpg",
		description: "Festivales de música electrónica premium",
		website: "https://edmmexico.com",
		email: "info@edmmexico.com",
		phone: "+52 998 888 9999",
		address: {
			street: "Blvd. Kukulcán km 12.5",
			city: "Cancún",
			state: "Quintana Roo",
			postalCode: "77500",
			country: "México",
		},
		taxId: "EDM150601JKL",
		status: "active",
		plan: "starter",
		settings: {
			currency: "USD",
			timezone: "America/Cancun",
			language: "en",
			commissionRate: 12,
			payoutSchedule: "weekly",
			notificationPreferences: { email: true, sms: true, push: true },
			branding: { primaryColor: "#EC4899", secondaryColor: "#8B5CF6" },
		},
		createdAt: "2024-09-15T00:00:00Z",
		updatedAt: "2025-01-02T00:00:00Z",
	},
	{
		id: "org-6",
		name: "Nuevo Promotor MX",
		slug: "nuevo-promotor",
		description: "Nueva empresa de eventos en proceso de verificación",
		email: "nuevo@promotor.mx",
		status: "pending",
		plan: "starter",
		settings: {
			currency: "MXN",
			timezone: "America/Mexico_City",
			language: "es",
			commissionRate: 15,
			payoutSchedule: "monthly",
			notificationPreferences: { email: true, sms: false, push: false },
			branding: {},
		},
		createdAt: "2025-01-10T00:00:00Z",
		updatedAt: "2025-01-10T00:00:00Z",
	},
];

// Mock Organization Members
export const mockOrgMembers: OrganizationMember[] = [
	// OCESA team
	{
		id: "member-1",
		userId: "user-1",
		organizationId: "org-1",
		role: "owner",
		permissions: rolePermissions.owner,
		status: "active",
		invitedAt: "2024-01-15T00:00:00Z",
		joinedAt: "2024-01-15T00:00:00Z",
	},
	{
		id: "member-2",
		userId: "user-2",
		organizationId: "org-1",
		role: "admin",
		permissions: rolePermissions.admin,
		status: "active",
		invitedAt: "2024-02-01T00:00:00Z",
		joinedAt: "2024-02-03T00:00:00Z",
	},
	{
		id: "member-3",
		userId: "user-3",
		organizationId: "org-1",
		role: "manager",
		permissions: rolePermissions.manager,
		status: "active",
		invitedAt: "2024-03-15T00:00:00Z",
		joinedAt: "2024-03-16T00:00:00Z",
	},
	{
		id: "member-4",
		userId: "user-4",
		organizationId: "org-1",
		role: "staff",
		permissions: rolePermissions.staff,
		status: "active",
		invitedAt: "2024-06-01T00:00:00Z",
		joinedAt: "2024-06-02T00:00:00Z",
	},
	{
		id: "member-5",
		userId: "user-5",
		organizationId: "org-1",
		role: "staff",
		permissions: rolePermissions.staff,
		status: "pending",
		invitedAt: "2025-01-10T00:00:00Z",
	},
	// Live Nation team
	{
		id: "member-6",
		userId: "user-1",
		organizationId: "org-2",
		role: "admin",
		permissions: rolePermissions.admin,
		status: "active",
		invitedAt: "2024-03-20T00:00:00Z",
		joinedAt: "2024-03-20T00:00:00Z",
	},
];

// Dashboard Statistics Types
export interface OrgDashboardStats {
	totalRevenue: number;
	ticketsSold: number;
	activeEvents: number;
	upcomingEvents: number;
	totalCustomers: number;
	averageTicketPrice: number;
	conversionRate: number;
	revenueGrowth: number;
}

export interface OrgRevenueData {
	month: string;
	revenue: number;
	tickets: number;
}

export interface OrgEventPerformance {
	eventId: string;
	eventName: string;
	ticketsSold: number;
	revenue: number;
	capacity: number;
	soldPercentage: number;
}

// Mock Dashboard Data
export const mockDashboardStats: Record<string, OrgDashboardStats> = {
	"org-1": {
		totalRevenue: 45_678_900,
		ticketsSold: 28_450,
		activeEvents: 12,
		upcomingEvents: 8,
		totalCustomers: 15_230,
		averageTicketPrice: 1_605,
		conversionRate: 4.2,
		revenueGrowth: 12.5,
	},
	"org-2": {
		totalRevenue: 32_456_000,
		ticketsSold: 18_900,
		activeEvents: 8,
		upcomingEvents: 5,
		totalCustomers: 9_800,
		averageTicketPrice: 1_718,
		conversionRate: 3.8,
		revenueGrowth: 8.3,
	},
	"org-3": {
		totalRevenue: 12_890_000,
		ticketsSold: 8_200,
		activeEvents: 4,
		upcomingEvents: 3,
		totalCustomers: 4_500,
		averageTicketPrice: 1_572,
		conversionRate: 5.1,
		revenueGrowth: 22.4,
	},
	"org-4": {
		totalRevenue: 8_765_000,
		ticketsSold: 6_100,
		activeEvents: 6,
		upcomingEvents: 4,
		totalCustomers: 3_200,
		averageTicketPrice: 1_437,
		conversionRate: 6.2,
		revenueGrowth: 15.8,
	},
	"org-5": {
		totalRevenue: 5_432_000,
		ticketsSold: 2_800,
		activeEvents: 2,
		upcomingEvents: 1,
		totalCustomers: 1_800,
		averageTicketPrice: 1_940,
		conversionRate: 7.5,
		revenueGrowth: 45.2,
	},
};

export const mockRevenueData: Record<string, OrgRevenueData[]> = {
	"org-1": [
		{ month: "Jul", revenue: 3_200_000, tickets: 2_100 },
		{ month: "Ago", revenue: 4_100_000, tickets: 2_600 },
		{ month: "Sep", revenue: 3_800_000, tickets: 2_400 },
		{ month: "Oct", revenue: 5_200_000, tickets: 3_200 },
		{ month: "Nov", revenue: 4_600_000, tickets: 2_900 },
		{ month: "Dic", revenue: 6_800_000, tickets: 4_100 },
		{ month: "Ene", revenue: 5_400_000, tickets: 3_400 },
	],
};

export const mockEventPerformance: Record<string, OrgEventPerformance[]> = {
	"org-1": [
		{
			eventId: "2",
			eventName: "Bad Bunny World Tour",
			ticketsSold: 32_000,
			revenue: 89_600_000,
			capacity: 35_500,
			soldPercentage: 90.1,
		},
		{
			eventId: "6",
			eventName: "Coldplay - Music of the Spheres",
			ticketsSold: 28_500,
			revenue: 71_200_000,
			capacity: 30_000,
			soldPercentage: 95.0,
		},
		{
			eventId: "22",
			eventName: "Alejandro Sanz - Sinfónico",
			ticketsSold: 5_200,
			revenue: 9_880_000,
			capacity: 6_000,
			soldPercentage: 86.7,
		},
		{
			eventId: "1",
			eventName: "Summer Music Festival 2025",
			ticketsSold: 4_200,
			revenue: 8_400_000,
			capacity: 5_600,
			soldPercentage: 75.0,
		},
	],
};
