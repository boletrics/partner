import type { Meta, StoryObj } from "@storybook/react";
import { CustomersView } from "@/components/org/views/customers-view";

const meta: Meta<typeof CustomersView> = {
	title: "Views/Partner/CustomersView",
	component: CustomersView,
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

type Story = StoryObj<typeof CustomersView>;

export const Default: Story = {};
