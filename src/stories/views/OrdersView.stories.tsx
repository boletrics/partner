import type { Meta, StoryObj } from "@storybook/react";
import { OrdersView } from "@/components/org/views/orders-view";
import { SWRConfig } from "swr";

const mockOrders = [
	{
		id: "ord-001",
		order_number: "ORD-2025-001",
		email: "john@example.com",
		status: "paid",
		total: 1500,
		created_at: "2025-01-15T10:30:00Z",
		event: { title: "Rock Festival 2025" },
		items: [{ quantity: 3, ticket_type: { name: "General" } }],
	},
	{
		id: "ord-002",
		order_number: "ORD-2025-002",
		email: "jane@example.com",
		status: "pending",
		total: 800,
		created_at: "2025-01-14T14:20:00Z",
		event: { title: "Jazz Night" },
		items: [{ quantity: 1, ticket_type: { name: "VIP" } }],
	},
	{
		id: "ord-003",
		order_number: "ORD-2025-003",
		email: "bob@example.com",
		status: "refunded",
		total: 2400,
		created_at: "2025-01-13T09:00:00Z",
		event: { title: "Tech Conference" },
		items: [{ quantity: 2, ticket_type: { name: "Early Bird" } }],
	},
];

const meta: Meta<typeof OrdersView> = {
	title: "Views/Partner/OrdersView",
	component: OrdersView,
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
						Promise.resolve({ data: mockOrders, total: mockOrders.length }),
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

type Story = StoryObj<typeof OrdersView>;

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
