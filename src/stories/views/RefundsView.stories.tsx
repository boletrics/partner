import type { Meta, StoryObj } from "@storybook/react";
import { RefundsView } from "@/components/org/views/refunds-view";

const meta: Meta<typeof RefundsView> = {
	title: "Views/Partner/RefundsView",
	component: RefundsView,
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

type Story = StoryObj<typeof RefundsView>;

export const Default: Story = {};
