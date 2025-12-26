import type { Meta, StoryObj } from "@storybook/react";
import { EventsNewView } from "@/components/org/views/events-new-view";

const meta: Meta<typeof EventsNewView> = {
	title: "Views/Partner/EventsNewView",
	component: EventsNewView,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
		},
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

type Story = StoryObj<typeof EventsNewView>;

export const Default: Story = {};
