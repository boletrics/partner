"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import { useOrgStore } from "../../org-store";
import type {
	Ticket,
	TicketsQueryParams,
	CheckInTicketResult,
	PaginatedResult,
} from "../types";

// ============================================================================
// Tickets Hooks
// ============================================================================

/**
 * Fetch tickets for an event (for scanning).
 */
export function useEventTickets(
	eventId: string | null,
	params: Omit<TicketsQueryParams, "event_id"> = {},
) {
	const queryString = buildQueryString({
		...params,
		event_id: eventId ?? undefined,
	});

	return useApiQuery<PaginatedResult<Ticket>>(
		eventId ? `/tickets${queryString}` : null,
	);
}

/**
 * Fetch tickets for an order.
 */
export function useOrderTickets(
	orderId: string | null,
	params: Omit<TicketsQueryParams, "order_id"> = {},
) {
	const queryString = buildQueryString({
		...params,
		order_id: orderId ?? undefined,
	});

	return useApiQuery<PaginatedResult<Ticket>>(
		orderId ? `/tickets${queryString}` : null,
	);
}

/**
 * Fetch a single ticket by ID.
 */
export function useTicket(ticketId: string | null) {
	return useApiQuery<Ticket>(
		ticketId ? `/tickets/${ticketId}?include=event,ticket_type,order` : null,
	);
}

/**
 * Fetch a ticket by code (for scanning).
 */
export function useTicketByCode(ticketCode: string | null) {
	return useApiQuery<Ticket>(
		ticketCode ? `/tickets/code/${ticketCode}?include=event,ticket_type` : null,
	);
}

// ============================================================================
// Ticket Mutations
// ============================================================================

/**
 * Check in a ticket.
 */
export function useCheckInTicket() {
	const mutation = useApiMutation<CheckInTicketResult, { ticket_code: string }>(
		"/tickets/checkin",
		"POST",
	);

	const checkInTicket = async (ticketCode: string) => {
		const result = await mutation.trigger({ ticket_code: ticketCode });
		revalidate(/\/tickets/);
		return result;
	};

	return {
		...mutation,
		checkInTicket,
	};
}

/**
 * Cancel a ticket.
 */
export function useCancelTicket(ticketId: string) {
	const mutation = useApiMutation<Ticket, { status: "cancelled" }>(
		`/tickets/${ticketId}`,
		"PUT",
	);

	const cancelTicket = async () => {
		const result = await mutation.trigger({ status: "cancelled" });
		revalidate(`/tickets/${ticketId}`);
		revalidate(/\/tickets/);
		return result;
	};

	return {
		...mutation,
		cancelTicket,
	};
}

// ============================================================================
// Ticket Stats Hook
// ============================================================================

export interface TicketStats {
	total: number;
	valid: number;
	used: number;
	cancelled: number;
	refunded: number;
	check_in_rate: number;
}

/**
 * Fetch ticket stats for an event.
 */
export function useEventTicketStats(eventId: string | null) {
	return useApiQuery<TicketStats>(
		eventId ? `/tickets/stats?event_id=${eventId}` : null,
	);
}

/**
 * Fetch ticket stats for the current organization.
 */
export function useOrganizationTicketStats() {
	const { currentOrg } = useOrgStore();
	const organizationId = currentOrg?.id;

	return useApiQuery<TicketStats>(
		organizationId ? `/tickets/stats?organization_id=${organizationId}` : null,
	);
}
