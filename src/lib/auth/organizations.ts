import type {
	Organization,
	OrganizationMember,
	OrganizationSettings,
} from "../org-store";
import { DEFAULT_ORG_SETTINGS } from "../org-store";
import { getAuthAppUrl, getAuthServiceUrl } from "./config";

type ApiResult<T> = {
	data: T | null;
	error: string | null;
};

type SuccessEnvelope<T> = {
	success?: boolean;
	data?: T;
	message?: string;
};

const JSON_HEADERS = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

async function http<T>(
	path: string,
	init?: RequestInit,
): Promise<ApiResult<T>> {
	try {
		const response = await fetch(`${getAuthServiceUrl()}${path}`, {
			credentials: "include",
			headers: {
				...JSON_HEADERS,
				Origin: getAuthAppUrl(),
				...(init?.headers || {}),
			},
			...init,
		});

		const body = (await response.json().catch(() => null)) as
			| SuccessEnvelope<T>
			| T
			| null;

		if (!response.ok) {
			const message =
				(body as SuccessEnvelope<T>)?.message ||
				response.statusText ||
				"Request failed";
			return { data: null, error: message };
		}

		if (body && typeof body === "object" && "data" in body) {
			return { data: (body as SuccessEnvelope<T>).data ?? null, error: null };
		}

		return { data: body as T, error: null };
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unexpected error",
		};
	}
}

function generateId(prefix: string) {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return `${prefix}-${crypto.randomUUID()}`;
	}
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeSettings(
	metadata?: Record<string, unknown> | null,
): OrganizationSettings {
	const maybeSettings = metadata?.settings as
		| Partial<OrganizationSettings>
		| undefined;
	return {
		...DEFAULT_ORG_SETTINGS,
		...maybeSettings,
		notificationPreferences: {
			...DEFAULT_ORG_SETTINGS.notificationPreferences,
			...(maybeSettings?.notificationPreferences ?? {}),
		},
		branding: {
			...DEFAULT_ORG_SETTINGS.branding,
			...(maybeSettings?.branding ?? {}),
		},
	};
}

function normalizeOrganization(raw: any): Organization {
	if (!raw || typeof raw !== "object") {
		return {
			id: generateId("org"),
			name: "Sin nombre",
			slug: "",
			status: "active",
			plan: "starter",
			settings: DEFAULT_ORG_SETTINGS,
			metadata: null,
		};
	}

	const metadata = (raw.metadata as Record<string, unknown> | null) ?? null;

	return {
		id: raw.id ?? raw.organizationId ?? generateId("org"),
		name: raw.name ?? raw.title ?? "Sin nombre",
		slug: raw.slug ?? "",
		logo: raw.logo ?? null,
		description: raw.description ?? null,
		website: raw.website ?? null,
		email: raw.email ?? null,
		phone: raw.phone ?? null,
		address: (raw.address as Organization["address"]) ?? null,
		taxId: raw.taxId ?? null,
		status: (metadata?.status as Organization["status"]) ?? "active",
		plan: (metadata?.plan as Organization["plan"]) ?? "starter",
		settings: normalizeSettings(metadata),
		metadata,
		createdAt: raw.createdAt ?? raw.created_at ?? undefined,
		updatedAt: raw.updatedAt ?? raw.updated_at ?? undefined,
	};
}

function normalizeMember(raw: any): OrganizationMember {
	const user = (raw && typeof raw === "object" && raw.user) || {};
	const permissions = Array.isArray(raw?.permissions)
		? (raw.permissions as string[])
		: raw?.permission
			? [raw.permission]
			: [];

	return {
		id: raw.id ?? `${raw.userId ?? "user"}-${raw.organizationId ?? "org"}`,
		userId: raw.userId ?? user.id ?? "",
		organizationId: raw.organizationId ?? raw.orgId ?? "",
		role: (raw.role as OrganizationMember["role"]) ?? "member",
		permissions,
		status: raw.status ?? raw.membershipStatus ?? "active",
		invitedAt: raw.invitedAt ?? raw.createdAt ?? undefined,
		joinedAt: raw.joinedAt ?? undefined,
		email: raw.email ?? user.email ?? null,
		name: raw.name ?? user.name ?? null,
		avatar: raw.avatar ?? user.image ?? null,
	};
}

export type CreateOrganizationInput = {
	name: string;
	slug: string;
	logo?: string;
	metadata?: Record<string, unknown>;
	keepCurrentActiveOrganization?: boolean;
};

export async function listOrganizations(): Promise<
	ApiResult<{
		organizations: Organization[];
		activeOrganizationId: string | null;
	}>
> {
	const result = await http<any>("/api/auth/organization/list");
	if (result.error) {
		return { data: null, error: result.error };
	}

	const payload = result.data;
	const organizationsRaw = Array.isArray(payload)
		? payload
		: (payload?.organizations ?? []);
	const activeOrganizationId =
		payload?.activeOrganizationId ?? payload?.activeOrgId ?? null;

	return {
		data: {
			organizations: organizationsRaw.map(normalizeOrganization),
			activeOrganizationId,
		},
		error: null,
	};
}

export async function createOrganization(
	input: CreateOrganizationInput,
): Promise<ApiResult<Organization>> {
	const result = await http<any>("/api/auth/organization/create", {
		method: "POST",
		body: JSON.stringify(input),
	});

	if (result.error) {
		return { data: null, error: result.error };
	}

	const payload = result.data;
	const organization = payload?.organization ?? payload;
	return { data: normalizeOrganization(organization), error: null };
}

export async function setActiveOrganization(
	organizationId: string,
): Promise<ApiResult<{ activeOrganizationId: string }>> {
	const result = await http<any>("/api/auth/organization/set-active", {
		method: "POST",
		body: JSON.stringify({ organizationId }),
	});

	if (result.error) {
		return { data: null, error: result.error };
	}

	const activeOrganizationId =
		result.data?.activeOrganizationId ??
		result.data?.organizationId ??
		organizationId;

	return { data: { activeOrganizationId }, error: null };
}

export async function listMembers(
	organizationId: string,
): Promise<ApiResult<OrganizationMember[]>> {
	const url = new URL(
		`${getAuthServiceUrl()}/api/auth/organization/list-members`,
	);
	url.searchParams.set("organizationId", organizationId);

	const result = await http<any>(url.pathname + url.search);
	if (result.error) {
		return { data: null, error: result.error };
	}

	const membersRaw = Array.isArray(result.data)
		? result.data
		: (result.data?.members ?? []);

	return { data: membersRaw.map(normalizeMember), error: null };
}

export async function inviteMember(input: {
	email: string;
	role: string | string[];
	organizationId?: string;
	resend?: boolean;
}): Promise<ApiResult<unknown>> {
	const result = await http("/api/auth/organization/invite-member", {
		method: "POST",
		body: JSON.stringify(input),
	});

	if (result.error) {
		return { data: null, error: result.error };
	}

	return { data: result.data, error: null };
}

export async function acceptInvitation(
	invitationId: string,
): Promise<ApiResult<unknown>> {
	const result = await http("/api/auth/organization/accept-invitation", {
		method: "POST",
		body: JSON.stringify({ invitationId }),
	});

	if (result.error) {
		return { data: null, error: result.error };
	}

	return { data: result.data, error: null };
}
