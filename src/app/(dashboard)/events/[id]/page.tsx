"use client";

import { useParams } from "next/navigation";
import { EventDetailView } from "@/components/org/views/event-detail-view";

export default function EventDetailPage() {
	const params = useParams();
	const eventId = params.id as string;

	return <EventDetailView eventId={eventId} />;
}
