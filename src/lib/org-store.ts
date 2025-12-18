"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Organization Types
export interface Organization {
	id: string;
	name: string;
	slug: string;
	logo?: string;
	description?: string;
	website?: string;
	email: string;
	phone?: string;
	address?: OrganizationAddress;
	taxId?: string; // RFC in Mexico
	status: "pending" | "active" | "suspended" | "inactive";
	plan: "starter" | "professional" | "enterprise";
	settings: OrganizationSettings;
	createdAt: string;
	updatedAt: string;
}

export interface OrganizationAddress {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
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

// Organization Member Types
export interface OrganizationMember {
	id: string;
	userId: string;
	organizationId: string;
	role: OrganizationRole;
	permissions: Permission[];
	status: "pending" | "active" | "suspended";
	invitedAt: string;
	joinedAt?: string;
}

export type OrganizationRole =
	| "owner"
	| "admin"
	| "manager"
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
	staff: ["events:read", "tickets:scan", "orders:read"],
	readonly: ["events:read", "orders:read", "analytics:read"],
};

// Organization Store
interface OrgStore {
	currentOrg: Organization | null;
	organizations: Organization[];
	members: OrganizationMember[];
	setCurrentOrg: (org: Organization | null) => void;
	setOrganizations: (orgs: Organization[]) => void;
	addOrganization: (org: Organization) => void;
	updateOrganization: (id: string, updates: Partial<Organization>) => void;
	setMembers: (members: OrganizationMember[]) => void;
	hasPermission: (permission: Permission) => boolean;
	getCurrentMember: () => OrganizationMember | null;
}

// Mock current user ID (in real app, this would come from auth)
const MOCK_CURRENT_USER_ID = "user-1";

export const useOrgStore = create<OrgStore>()(
	persist(
		(set, get) => ({
			currentOrg: null,
			organizations: [],
			members: [],
			setCurrentOrg: (org) => set({ currentOrg: org }),
			setOrganizations: (orgs) => set({ organizations: orgs }),
			addOrganization: (org) =>
				set((state) => ({
					organizations: [...state.organizations, org],
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
			hasPermission: (permission) => {
				const member = get().getCurrentMember();
				if (!member) return false;
				return member.permissions.includes(permission);
			},
			getCurrentMember: () => {
				const { currentOrg, members } = get();
				if (!currentOrg) return null;
				return (
					members.find(
						(m) =>
							m.organizationId === currentOrg.id &&
							m.userId === MOCK_CURRENT_USER_ID,
					) || null
				);
			},
		}),
		{
			name: "org-storage",
		},
	),
);
