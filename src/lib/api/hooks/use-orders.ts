"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import { useOrgStore } from "../../org-store";
import type { Order, OrdersQueryParams, PaginatedResult } from "../types";

// ============================================================================
// Orders Hooks (Organization-scoped)
// ============================================================================

/**
 * Fetch orders for the current organization.
 */
export function useOrganizationOrders(
	params: Omit<OrdersQueryParams, "organization_id"> = {},
) {
	const { currentOrg } = useOrgStore();
	const organizationId = currentOrg?.id;

	const queryString = buildQueryString({
		...params,
		organization_id: organizationId ?? undefined,
	});

	return useApiQuery<PaginatedResult<Order>>(
		organizationId ? `/orders${queryString}` : null,
	);
}

/**
 * Fetch orders for a specific event.
 */
export function useEventOrders(
	eventId: string | null,
	params: Omit<OrdersQueryParams, "event_id"> = {},
) {
	const queryString = buildQueryString({
		...params,
		event_id: eventId ?? undefined,
	});

	return useApiQuery<PaginatedResult<Order>>(
		eventId ? `/orders${queryString}` : null,
	);
}

/**
 * Fetch a single order by ID.
 */
export function useOrder(orderId: string | null) {
	return useApiQuery<Order>(
		orderId ? `/orders/${orderId}?include=items,tickets,event` : null,
	);
}

// ============================================================================
// Order Mutations
// ============================================================================

/**
 * Refund an order.
 */
export function useRefundOrder(orderId: string) {
	const mutation = useApiMutation<Order, { status: "refunded" }>(
		`/orders/${orderId}`,
		"PUT",
	);

	const refundOrder = async () => {
		const result = await mutation.trigger({ status: "refunded" });
		revalidate(`/orders/${orderId}`);
		revalidate(/\/orders/);
		return result;
	};

	return {
		...mutation,
		refundOrder,
	};
}

/**
 * Cancel an order.
 */
export function useCancelOrder(orderId: string) {
	const mutation = useApiMutation<Order, { status: "cancelled" }>(
		`/orders/${orderId}`,
		"PUT",
	);

	const cancelOrder = async () => {
		const result = await mutation.trigger({ status: "cancelled" });
		revalidate(`/orders/${orderId}`);
		revalidate(/\/orders/);
		return result;
	};

	return {
		...mutation,
		cancelOrder,
	};
}

// ============================================================================
// Order Statistics
// ============================================================================

export interface OrderStats {
	total_orders: number;
	total_revenue: number;
	orders_by_status: Record<string, number>;
	average_order_value: number;
}

/**
 * Fetch order statistics for the current organization.
 */
export function useOrganizationOrderStats() {
	const { currentOrg } = useOrgStore();
	const organizationId = currentOrg?.id;

	return useApiQuery<OrderStats>(
		organizationId ? `/orders/stats?organization_id=${organizationId}` : null,
	);
}

/**
 * Fetch order statistics for an event.
 */
export function useEventOrderStats(eventId: string | null) {
	return useApiQuery<OrderStats>(
		eventId ? `/orders/stats?event_id=${eventId}` : null,
	);
}
