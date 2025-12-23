import type { Meta, StoryObj } from "@storybook/react";
import { FinanceView } from "@/components/org/views/finance-view";

const meta: Meta<typeof FinanceView> = {
	title: "Views/Partner/FinanceView",
	component: FinanceView,
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

type Story = StoryObj<typeof FinanceView>;

export const Default: Story = {};
