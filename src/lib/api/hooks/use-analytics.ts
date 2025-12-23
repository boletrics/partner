"use client";

import { useApiQuery, buildQueryString } from "../client";
import { useOrgStore } from "../../org-store";
import type { OrganizationAnalytics } from "../types";

// ============================================================================
// Analytics Hooks
// ============================================================================

export interface AnalyticsQueryParams {
	start_date?: string;
	end_date?: string;
	granularity?: "day" | "week" | "month";
	[key: string]: string | number | boolean | undefined | null;
}

/**
 * Fetch analytics for the current organization.
 */
export function useOrganizationAnalytics(params: AnalyticsQueryParams = {}) {
	const { currentOrg } = useOrgStore();
	const organizationId = currentOrg?.id;

	const queryString = buildQueryString({
		...params,
		organization_id: organizationId ?? undefined,
	});

	return useApiQuery<OrganizationAnalytics>(
		organizationId ? `/analytics/organization${queryString}` : null,
	);
}

/**
 * Fetch revenue analytics for the current organization.
 */
export function useRevenueAnalytics(params: AnalyticsQueryParams = {}) {
	const { currentOrg } = useOrgStore();
	const organizationId = currentOrg?.id;

	const queryString = buildQueryString({
		...params,
		organization_id: organizationId ?? undefined,
	});

	return useApiQuery<{
		total_revenue: number;
		revenue_by_period: Array<{ date: string; revenue: number }>;
		revenue_by_event: Array<{
			event_id: string;
			event_title: string;
			revenue: number;
		}>;
		revenue_growth: number;
	}>(organizationId ? `/analytics/revenue${queryString}` : null);
}

/**
 * Fetch sales analytics for the current organization.
 */
export function useSalesAnalytics(params: AnalyticsQueryParams = {}) {
	const { currentOrg } = useOrgStore();
	const organizationId = currentOrg?.id;

	const queryString = buildQueryString({
		...params,
		organization_id: organizationId ?? undefined,
	});

	return useApiQuery<{
		total_tickets_sold: number;
		tickets_by_period: Array<{ date: string; tickets: number }>;
		tickets_by_event: Array<{
			event_id: string;
			event_title: string;
			tickets_sold: number;
		}>;
		conversion_rate: number;
	}>(organizationId ? `/analytics/sales${queryString}` : null);
}

/**
 * Fetch event-specific analytics.
 */
export function useEventAnalytics(
	eventId: string | null,
	params: AnalyticsQueryParams = {},
) {
	const queryString = buildQueryString(params);

	return useApiQuery<{
		event_id: string;
		total_tickets_sold: number;
		total_revenue: number;
		tickets_by_type: Array<{
			ticket_type_id: string;
			name: string;
			sold: number;
			available: number;
		}>;
		sales_by_period: Array<{
			date: string;
			tickets: number;
			revenue: number;
		}>;
		check_in_stats: {
			checked_in: number;
			total: number;
			rate: number;
		};
	}>(eventId ? `/analytics/events/${eventId}${queryString}` : null);
}
