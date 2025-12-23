/**
 * Default URLs for API services.
 * These are fallbacks when environment variables are not set.
 */
export const DEFAULT_TICKETS_SVC_URL =
	"https://tickets-svc.boletrics.workers.dev";

/**
 * Base URL for the tickets-svc API.
 *
 * - Server: prefer `TICKETS_SVC_URL`
 * - Client: `NEXT_PUBLIC_TICKETS_SVC_URL`
 */
export function getTicketsSvcUrl(): string {
	return (
		process.env.TICKETS_SVC_URL ??
		process.env.NEXT_PUBLIC_TICKETS_SVC_URL ??
		DEFAULT_TICKETS_SVC_URL
	);
}
