import type { Meta, StoryObj } from "@storybook/react";
import { ScanView } from "@/components/org/views/scan-view";
import { SWRConfig } from "swr";

const mockEvents = [
	{ id: "1", title: "Rock Festival 2025" },
	{ id: "2", title: "Jazz Night" },
	{ id: "3", title: "Tech Conference" },
];

const meta: Meta<typeof ScanView> = {
	title: "Views/Partner/ScanView",
	component: ScanView,
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

type Story = StoryObj<typeof ScanView>;

export const Default: Story = {};

export const NoEvents: Story = {
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
