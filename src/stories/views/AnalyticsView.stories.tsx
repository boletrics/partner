import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsView } from "@/components/org/views/analytics-view";

const meta: Meta<typeof AnalyticsView> = {
	title: "Views/Partner/AnalyticsView",
	component: AnalyticsView,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="p-6 bg-background min-h-screen">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AnalyticsView>;

export const Default: Story = {};
