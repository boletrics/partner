import type { Meta, StoryObj } from "@storybook/react";
import { EventsView } from "@/components/org/views/events-view";
import { SWRConfig } from "swr";

const mockEvents = [
	{
		id: "1",
		title: "Rock Festival 2025",
		status: "published",
		venue: { name: "Foro Sol", address: "Mexico City" },
		dates: [{ date: "2025-06-15", start_time: "20:00" }],
		ticket_types: [
			{
				id: "1",
				name: "General",
				price: 500,
				quantity_sold: 150,
				quantity_available: 350,
			},
		],
	},
	{
		id: "2",
		title: "Jazz Night",
		status: "draft",
		venue: { name: "Teatro Diana", address: "Guadalajara" },
		dates: [{ date: "2025-07-20", start_time: "21:00" }],
		ticket_types: [
			{
				id: "1",
				name: "VIP",
				price: 800,
				quantity_sold: 0,
				quantity_available: 100,
			},
		],
	},
	{
		id: "3",
		title: "Tech Conference",
		status: "published",
		venue: { name: "Centro de Convenciones", address: "Monterrey" },
		dates: [{ date: "2025-08-10", start_time: "09:00" }],
		ticket_types: [
			{
				id: "1",
				name: "Early Bird",
				price: 1200,
				quantity_sold: 80,
				quantity_available: 20,
			},
		],
	},
];

const meta: Meta<typeof EventsView> = {
	title: "Views/Partner/EventsView",
	component: EventsView,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
		},
	},
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () =>
						Promise.resolve({ data: mockEvents, total: mockEvents.length }),
					dedupingInterval: 0,
				}}
			>
				<div className="p-6 bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};

export default meta;

type Story = StoryObj<typeof EventsView>;

export const Default: Story = {};

export const Empty: Story = {
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => Promise.resolve({ data: [], total: 0 }),
					dedupingInterval: 0,
				}}
			>
				<div className="p-6 bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};

export const Loading: Story = {
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => new Promise(() => {}),
					dedupingInterval: 0,
				}}
			>
				<div className="p-6 bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};
