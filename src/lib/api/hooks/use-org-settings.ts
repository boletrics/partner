"use client";

import { useApiQuery, useApiMutation, revalidate } from "../client";
import { useOrgStore } from "../../org-store";
import type {
	OrganizationSettings,
	CreateOrgSettingsInput,
	UpdateOrgSettingsInput,
} from "../types";

// ============================================================================
// Organization Settings Hooks
// ============================================================================

/**
 * Fetch settings for the current organization.
 * These are ticketing-specific settings stored in tickets-svc.
 */
export function useOrgSettings() {
	const { currentOrg } = useOrgStore();
	const orgId = currentOrg?.id;

	return useApiQuery<OrganizationSettings>(
		orgId ? `/org-settings/${orgId}` : null,
	);
}

/**
 * Fetch settings for a specific organization by ID.
 */
export function useOrgSettingsById(orgId: string | null) {
	return useApiQuery<OrganizationSettings>(
		orgId ? `/org-settings/${orgId}` : null,
	);
}

// ============================================================================
// Organization Settings Mutations
// ============================================================================

/**
 * Create settings for a new organization.
 * This should be called after creating an organization in auth-svc.
 */
export function useCreateOrgSettings() {
	const mutation = useApiMutation<OrganizationSettings, CreateOrgSettingsInput>(
		"/org-settings",
		"POST",
	);

	const createSettings = async (data: CreateOrgSettingsInput) => {
		const result = await mutation.trigger(data);
		revalidate(`/org-settings/${data.org_id}`);
		revalidate(/\/org-settings/);
		return result;
	};

	return {
		...mutation,
		createSettings,
	};
}

/**
 * Update settings for the current organization.
 */
export function useUpdateOrgSettings() {
	const { currentOrg } = useOrgStore();
	const orgId = currentOrg?.id;

	const mutation = useApiMutation<OrganizationSettings, UpdateOrgSettingsInput>(
		orgId ? `/org-settings/${orgId}` : "/org-settings/__invalid__",
		"PUT",
	);

	const updateSettings = async (data: UpdateOrgSettingsInput) => {
		if (!orgId) {
			throw new Error("No organization selected");
		}
		const result = await mutation.trigger(data);
		revalidate(`/org-settings/${orgId}`);
		revalidate(/\/org-settings/);
		return result;
	};

	return {
		...mutation,
		updateSettings,
	};
}

/**
 * Update settings for a specific organization by ID.
 */
export function useUpdateOrgSettingsById(orgId: string) {
	const mutation = useApiMutation<OrganizationSettings, UpdateOrgSettingsInput>(
		`/org-settings/${orgId}`,
		"PUT",
	);

	const updateSettings = async (data: UpdateOrgSettingsInput) => {
		const result = await mutation.trigger(data);
		revalidate(`/org-settings/${orgId}`);
		revalidate(/\/org-settings/);
		return result;
	};

	return {
		...mutation,
		updateSettings,
	};
}
