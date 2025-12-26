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
 * Fetch events for the current organization with enriched venue and dates data.
 * Since API doesn't support include parameter, we fetch relations separately and merge.
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

	const { data: events, ...rest } = useApiQuery<Event[]>(
		orgId ? `/events${queryString}` : null,
	);

	// Fetch all venues (we'll filter client-side)
	const { data: venues } =
		useApiQuery<
			Array<{ id: string; name: string; city: string; state: string }>
		>("/venues?limit=500");

	// Fetch all event dates for this org's events
	const { data: eventDates } = useApiQuery<EventDate[]>(
		"/event-dates?limit=500",
	);

	// Fetch all ticket types for this org's events
	const { data: ticketTypes } = useApiQuery<TicketType[]>(
		"/ticket-types?limit=500",
	);

	// Create lookup maps
	const venueMap = new Map<string, Event["venue"]>();
	(venues ?? []).forEach((v) => venueMap.set(v.id, v as Event["venue"]));

	const datesByEvent = new Map<string, EventDate[]>();
	(eventDates ?? []).forEach((d) => {
		if (!datesByEvent.has(d.event_id)) {
			datesByEvent.set(d.event_id, []);
		}
		datesByEvent.get(d.event_id)!.push(d);
	});

	const ticketsByEvent = new Map<string, TicketType[]>();
	(ticketTypes ?? []).forEach((t) => {
		if (!ticketsByEvent.has(t.event_id)) {
			ticketsByEvent.set(t.event_id, []);
		}
		ticketsByEvent.get(t.event_id)!.push(t);
	});

	// Enrich events with venue, dates, and ticket_types
	const enrichedEvents = (events ?? []).map((event) => ({
		...event,
		venue: event.venue_id ? venueMap.get(event.venue_id) : undefined,
		dates: datesByEvent.get(event.id) ?? [],
		ticket_types: ticketsByEvent.get(event.id) ?? [],
	}));

	return { data: enrichedEvents, ...rest };
}

/**
 * Fetch a single event by ID with related venue data.
 * Since API doesn't support include parameter, we fetch venue separately and merge.
 */
export function useEvent(eventId: string | null) {
	const { data: event, ...rest } = useApiQuery<Event>(
		eventId ? `/events/${eventId}` : null,
	);

	// Fetch venue separately if event has venue_id
	const { data: venue } = useApiQuery<Event["venue"]>(
		event?.venue_id ? `/venues/${event.venue_id}` : null,
	);

	// Merge venue into event
	const enrichedEvent = event
		? {
				...event,
				venue: venue ?? event.venue,
			}
		: undefined;

	return { data: enrichedEvent, ...rest };
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
