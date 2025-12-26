import type { Meta, StoryObj } from "@storybook/react";
import { OrgDashboardOverview } from "@/components/org/org-dashboard-overview";
import { SWRConfig } from "swr";

const mockAnalytics = {
	total_revenue: 125000,
	total_tickets_sold: 450,
	active_events: 3,
	total_events: 8,
};

const mockRevenueAnalytics = {
	revenue_growth: 15.5,
	revenue_by_period: [
		{ date: "2025-01-01", revenue: 15000 },
		{ date: "2025-02-01", revenue: 22000 },
		{ date: "2025-03-01", revenue: 28000 },
		{ date: "2025-04-01", revenue: 35000 },
		{ date: "2025-05-01", revenue: 25000 },
	],
};

const mockSalesAnalytics = {
	total_customers: 320,
	conversion_rate: 4.5,
	tickets_by_period: [
		{ date: "2025-01-01", tickets: 80 },
		{ date: "2025-02-01", tickets: 95 },
		{ date: "2025-03-01", tickets: 110 },
		{ date: "2025-04-01", tickets: 120 },
		{ date: "2025-05-01", tickets: 45 },
	],
};

const mockEvents = {
	data: [
		{
			id: "1",
			title: "Rock Festival 2025",
			venue: { capacity: 500 },
			ticket_types: [
				{
					quantity_sold: 350,
					name: "General",
					price: 150,
					quantity_total: 500,
				},
			],
		},
		{
			id: "2",
			title: "Jazz Night",
			venue: { capacity: 200 },
			ticket_types: [
				{ quantity_sold: 80, name: "VIP", price: 250, quantity_total: 200 },
			],
		},
	],
};

const meta: Meta<typeof OrgDashboardOverview> = {
	title: "Views/Partner/OrgDashboardOverview",
	component: OrgDashboardOverview,
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
					fetcher: (key: string) => {
						if (key.includes("analytics"))
							return Promise.resolve(mockAnalytics);
						if (key.includes("revenue"))
							return Promise.resolve(mockRevenueAnalytics);
						if (key.includes("sales"))
							return Promise.resolve(mockSalesAnalytics);
						if (key.includes("events")) return Promise.resolve(mockEvents);
						return Promise.resolve({});
					},
					dedupingInterval: 0,
				}}
			>
				<div className="bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};

export default meta;

type Story = StoryObj<typeof OrgDashboardOverview>;

export const Default: Story = {};

export const Loading: Story = {
	decorators: [
		(Story) => (
			<SWRConfig
				value={{
					fetcher: () => new Promise(() => {}),
					dedupingInterval: 0,
				}}
			>
				<div className="bg-background min-h-screen">
					<Story />
				</div>
			</SWRConfig>
		),
	],
};
