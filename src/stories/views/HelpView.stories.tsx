import type { Meta, StoryObj } from "@storybook/react";
import { HelpView } from "@/components/org/views/help-view";

const meta: Meta<typeof HelpView> = {
	title: "Views/Partner/HelpView",
	component: HelpView,
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

type Story = StoryObj<typeof HelpView>;

export const Default: Story = {};
