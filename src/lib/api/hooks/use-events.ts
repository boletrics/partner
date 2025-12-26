"use client";

import {
	useApiQuery,
	useApiMutation,
	buildQueryString,
	revalidate,
} from "../client";
import { useOrgStore } from "../../org-store";
import type {
	Event,
	EventsQueryParams,
	CreateEventInput,
	UpdateEventInput,
	EventDate,
	TicketType,
	CreateEventDateInput,
	CreateTicketTypeInput,
	UpdateTicketTypeInput,
} from "../types";

// ============================================================================
// Events Hooks (Organization-scoped)
// ============================================================================

/**
 * Fetch events for the current organization.
 * Note: API doesn't support include parameter for relations
 */
export function useOrganizationEvents(
	params: Omit<EventsQueryParams, "org_id"> = {},
) {
	const { currentOrg } = useOrgStore();
	const orgId = currentOrg?.id;

	const queryString = buildQueryString({
		...params,
		org_id: orgId ?? undefined,
	});

	return useApiQuery<Event[]>(orgId ? `/events${queryString}` : null);
}

/**
 * Fetch a single event by ID.
 * Note: API doesn't support include parameter, relations are not included
 */
export function useEvent(eventId: string | null) {
	return useApiQuery<Event>(eventId ? `/events/${eventId}` : null);
}

// ============================================================================
// Event Mutations
// ============================================================================

/**
 * Create a new event.
 */
export function useCreateEvent() {
	const mutation = useApiMutation<Event, CreateEventInput>("/events", "POST");

	const createEvent = async (data: CreateEventInput) => {
		const result = await mutation.trigger(data);
		revalidate(/\/events/);
		return result;
	};

	return {
		...mutation,
		createEvent,
	};
}

/**
 * Update an existing event.
 */
export function useUpdateEvent(eventId: string) {
	const mutation = useApiMutation<Event, UpdateEventInput>(
		`/events/${eventId}`,
		"PUT",
	);

	const updateEvent = async (data: UpdateEventInput) => {
		const result = await mutation.trigger(data);
		revalidate(`/events/${eventId}`);
		revalidate(/\/events/);
		return result;
	};

	return {
		...mutation,
		updateEvent,
	};
}

/**
 * Delete an event.
 */
export function useDeleteEvent(eventId: string) {
	const mutation = useApiMutation<void, void>(`/events/${eventId}`, "DELETE");

	const deleteEvent = async () => {
		await mutation.trigger();
		revalidate(/\/events/);
	};

	return {
		...mutation,
		deleteEvent,
	};
}

/**
 * Publish an event.
 */
export function usePublishEvent(eventId: string) {
	const mutation = useApiMutation<
		Event,
		{ status: "published"; published_at: string }
	>(`/events/${eventId}`, "PUT");

	const publishEvent = async () => {
		const result = await mutation.trigger({
			status: "published",
			published_at: new Date().toISOString(),
		});
		revalidate(`/events/${eventId}`);
		revalidate(/\/events/);
		return result;
	};

	return {
		...mutation,
		publishEvent,
	};
}

/**
 * Cancel an event.
 */
export function useCancelEvent(eventId: string) {
	const mutation = useApiMutation<Event, { status: "cancelled" }>(
		`/events/${eventId}`,
		"PUT",
	);

	const cancelEvent = async () => {
		const result = await mutation.trigger({ status: "cancelled" });
		revalidate(`/events/${eventId}`);
		revalidate(/\/events/);
		return result;
	};

	return {
		...mutation,
		cancelEvent,
	};
}

// ============================================================================
// Event Dates Hooks
// ============================================================================

/**
 * Fetch event dates for a specific event.
 */
export function useEventDates(eventId: string | null) {
	const queryString = eventId ? buildQueryString({ event_id: eventId }) : "";
	return useApiQuery<EventDate[]>(
		eventId ? `/event-dates${queryString}` : null,
	);
}

/**
 * Add a date to an event.
 */
export function useAddEventDate(eventId: string) {
	const mutation = useApiMutation<EventDate, CreateEventDateInput>(
		`/event-dates`,
		"POST",
	);

	const addDate = async (data: Omit<CreateEventDateInput, "event_id">) => {
		const result = await mutation.trigger({
			...data,
			event_id: eventId,
		});
		revalidate(`/events/${eventId}`);
		revalidate(/\/event-dates/);
		return result;
	};

	return {
		...mutation,
		addDate,
	};
}

/**
 * Update an event date.
 */
export function useUpdateEventDate(eventId: string, dateId: string) {
	const mutation = useApiMutation<
		EventDate,
		Partial<Omit<CreateEventDateInput, "event_id">>
	>(`/event-dates/${dateId}`, "PUT");

	const updateDate = async (
		data: Partial<Omit<CreateEventDateInput, "event_id">>,
	) => {
		const result = await mutation.trigger(data);
		revalidate(`/events/${eventId}`);
		revalidate(/\/event-dates/);
		return result;
	};

	return {
		...mutation,
		updateDate,
	};
}

/**
 * Remove a date from an event.
 */
export function useRemoveEventDate(eventId: string, dateId: string) {
	const mutation = useApiMutation<void, void>(
		`/event-dates/${dateId}`,
		"DELETE",
	);

	const removeDate = async () => {
		await mutation.trigger();
		revalidate(`/events/${eventId}`);
		revalidate(/\/event-dates/);
	};

	return {
		...mutation,
		removeDate,
	};
}

// ============================================================================
// Ticket Types Mutations
// ============================================================================

/**
 * Add a ticket type to an event.
 */
export function useAddTicketType(eventId: string) {
	const mutation = useApiMutation<TicketType, CreateTicketTypeInput>(
		`/ticket-types`,
		"POST",
	);

	const addTicketType = async (
		data: Omit<CreateTicketTypeInput, "event_id">,
	) => {
		const result = await mutation.trigger({
			...data,
			event_id: eventId,
		});
		revalidate(`/events/${eventId}`);
		return result;
	};

	return {
		...mutation,
		addTicketType,
	};
}

/**
 * Update a ticket type.
 */
export function useUpdateTicketType(ticketTypeId: string) {
	const mutation = useApiMutation<TicketType, UpdateTicketTypeInput>(
		`/ticket-types/${ticketTypeId}`,
		"PUT",
	);

	const updateTicketType = async (data: UpdateTicketTypeInput) => {
		const result = await mutation.trigger(data);
		revalidate(/\/events/);
		revalidate(/\/ticket-types/);
		return result;
	};

	return {
		...mutation,
		updateTicketType,
	};
}

/**
 * Delete a ticket type.
 */
export function useDeleteTicketType(ticketTypeId: string) {
	const mutation = useApiMutation<void, void>(
		`/ticket-types/${ticketTypeId}`,
		"DELETE",
	);

	const deleteTicketType = async () => {
		await mutation.trigger();
		revalidate(/\/events/);
		revalidate(/\/ticket-types/);
	};

	return {
		...mutation,
		deleteTicketType,
	};
}
