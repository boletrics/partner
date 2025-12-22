"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Organization Types (aligned with Better Auth organization plugin)
export interface Organization {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
	description?: string | null;
	website?: string | null;
	email?: string | null;
	phone?: string | null;
	address?: OrganizationAddress | null;
	taxId?: string | null; // RFC in Mexico
	status?: "pending" | "active" | "suspended" | "inactive";
	plan?: "starter" | "professional" | "enterprise";
	settings?: OrganizationSettings;
	metadata?: Record<string, unknown> | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface OrganizationAddress {
	street?: string | null;
	city?: string | null;
	state?: string | null;
	postalCode?: string | null;
	country?: string | null;
}

export interface OrganizationSettings {
	currency: "MXN" | "USD";
	timezone: string;
	language: "es" | "en";
	commissionRate: number; // Platform commission percentage
	payoutSchedule: "daily" | "weekly" | "biweekly" | "monthly";
	notificationPreferences: {
		email: boolean;
		sms: boolean;
		push: boolean;
	};
	branding: {
		primaryColor?: string;
		secondaryColor?: string;
		customDomain?: string;
	};
}

export const DEFAULT_ORG_SETTINGS: OrganizationSettings = {
	currency: "MXN",
	timezone: "America/Mexico_City",
	language: "es",
	commissionRate: 0,
	payoutSchedule: "monthly",
	notificationPreferences: {
		email: true,
		sms: false,
		push: false,
	},
	branding: {},
};

// Organization Member Types
export interface OrganizationMember {
	id: string;
	userId: string;
	organizationId: string;
	role: OrganizationRole;
	permissions: Permission[];
	status?: "pending" | "active" | "suspended";
	invitedAt?: string;
	joinedAt?: string;
	email?: string | null;
	name?: string | null;
	avatar?: string | null;
}

export type OrganizationRole =
	| "owner"
	| "admin"
	| "manager"
	| "member"
	| "staff"
	| "readonly";

export type Permission =
	| "events:create"
	| "events:read"
	| "events:update"
	| "events:delete"
	| "events:publish"
	| "tickets:manage"
	| "tickets:scan"
	| "orders:read"
	| "orders:refund"
	| "analytics:read"
	| "finance:read"
	| "finance:withdraw"
	| "team:invite"
	| "team:manage"
	| "settings:read"
	| "settings:update";

// Role Permission Mappings
export const rolePermissions: Record<OrganizationRole, Permission[]> = {
	owner: [
		"events:create",
		"events:read",
		"events:update",
		"events:delete",
		"events:publish",
		"tickets:manage",
		"tickets:scan",
		"orders:read",
		"orders:refund",
		"analytics:read",
		"finance:read",
		"finance:withdraw",
		"team:invite",
		"team:manage",
		"settings:read",
		"settings:update",
	],
	admin: [
		"events:create",
		"events:read",
		"events:update",
		"events:delete",
		"events:publish",
		"tickets:manage",
		"tickets:scan",
		"orders:read",
		"orders:refund",
		"analytics:read",
		"finance:read",
		"team:invite",
		"team:manage",
		"settings:read",
		"settings:update",
	],
	manager: [
		"events:create",
		"events:read",
		"events:update",
		"events:publish",
		"tickets:manage",
		"tickets:scan",
		"orders:read",
		"analytics:read",
		"team:invite",
		"settings:read",
	],
	member: ["events:read", "orders:read", "analytics:read"],
	staff: ["events:read", "tickets:scan", "orders:read"],
	readonly: ["events:read", "orders:read", "analytics:read"],
};

// Organization Store
interface OrgStore {
	currentOrg: Organization | null;
	currentUserId: string | null;
	organizations: Organization[];
	members: OrganizationMember[];
	isLoading: boolean;
	error: string | null;
	setCurrentOrg: (org: Organization | null) => void;
	setCurrentOrgById: (id: string | null) => void;
	setCurrentUserId: (userId: string | null) => void;
	setOrganizations: (orgs: Organization[]) => void;
	addOrganization: (org: Organization) => void;
	updateOrganization: (id: string, updates: Partial<Organization>) => void;
	setMembers: (members: OrganizationMember[]) => void;
	setMembersForOrg: (
		organizationId: string,
		members: OrganizationMember[],
	) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	hasPermission: (permission: Permission) => boolean;
	getCurrentMember: () => OrganizationMember | null;
}

export const useOrgStore = create<OrgStore>()(
	persist(
		(set, get) => ({
			currentOrg: null,
			currentUserId: null,
			organizations: [],
			members: [],
			isLoading: false,
			error: null,
			setCurrentOrg: (org) => set({ currentOrg: org }),
			setCurrentOrgById: (id) =>
				set((state) => ({
					currentOrg:
						id !== null
							? state.organizations.find((org) => org.id === id) || null
							: null,
				})),
			setCurrentUserId: (userId) => set({ currentUserId: userId }),
			setOrganizations: (orgs) => set({ organizations: orgs }),
			addOrganization: (org) =>
				set((state) => ({
					organizations: [...state.organizations, org],
					currentOrg: org,
				})),
			updateOrganization: (id, updates) =>
				set((state) => ({
					organizations: state.organizations.map((org) =>
						org.id === id
							? { ...org, ...updates, updatedAt: new Date().toISOString() }
							: org,
					),
					currentOrg:
						state.currentOrg?.id === id
							? {
									...state.currentOrg,
									...updates,
									updatedAt: new Date().toISOString(),
								}
							: state.currentOrg,
				})),
			setMembers: (members) => set({ members }),
			setMembersForOrg: (organizationId, members) =>
				set((state) => ({
					members: [
						...state.members.filter(
							(member) => member.organizationId !== organizationId,
						),
						...members,
					],
				})),
			setLoading: (isLoading) => set({ isLoading }),
			setError: (error) => set({ error }),
			hasPermission: (permission) => {
				const member = get().getCurrentMember();
				if (!member) return false;
				return member.permissions.includes(permission);
			},
			getCurrentMember: () => {
				const { currentOrg, members, currentUserId } = get();
				if (!currentOrg) return null;
				return (
					members.find(
						(m) =>
							m.organizationId === currentOrg.id && m.userId === currentUserId,
					) || null
				);
			},
		}),
		{
			name: "org-storage",
		},
	),
);
