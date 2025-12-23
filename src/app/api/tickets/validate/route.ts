import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getTicketsSvcUrl } from "@/lib/api/config";

interface ValidateRequestBody {
	ticketCode: string;
	eventId: string;
}

interface ValidateSuccessResult {
	ticketType?: string;
	holderName?: string;
	seat?: string;
	section?: string;
}

interface ValidateErrorResult {
	error?: string;
	alreadyScanned?: boolean;
	scannedAt?: string;
}

/**
 * POST /api/tickets/validate
 * Validate a ticket by code for entry scanning
 */
export async function POST(request: NextRequest) {
	const session = await getServerSession();

	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = (await request.json()) as ValidateRequestBody;
		const { ticketCode, eventId } = body;

		if (!ticketCode || !eventId) {
			return NextResponse.json(
				{ error: "Ticket code and event ID are required", valid: false },
				{ status: 400 },
			);
		}

		// Call tickets-svc to validate the ticket
		const upstreamUrl = `${getTicketsSvcUrl()}/tickets/validate`;

		const response = await fetch(upstreamUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: request.headers.get("Authorization") || "",
			},
			body: JSON.stringify({
				ticketCode,
				eventId,
				scannedBy: session.user.id,
			}),
		});

		if (!response.ok) {
			const result = (await response.json()) as ValidateErrorResult;
			return NextResponse.json(
				{
					valid: false,
					error: result.error || "Ticket validation failed",
					alreadyScanned: result.alreadyScanned || false,
					scannedAt: result.scannedAt,
				},
				{ status: response.status },
			);
		}

		const result = (await response.json()) as ValidateSuccessResult;
		return NextResponse.json({
			valid: true,
			ticketType: result.ticketType,
			holderName: result.holderName,
			seat: result.seat,
			section: result.section,
		});
	} catch (error) {
		console.error("Ticket validation error:", error);
		return NextResponse.json(
			{ error: "Failed to validate ticket", valid: false },
			{ status: 500 },
		);
	}
}
