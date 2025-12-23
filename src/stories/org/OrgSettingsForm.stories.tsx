import type { Meta, StoryObj } from "@storybook/react";
import { OrgSettingsForm } from "@/components/org/org-settings-form";

const meta: Meta<typeof OrgSettingsForm> = {
	title: "Blocks/Partner/OrgSettingsForm",
	component: OrgSettingsForm,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="p-6 bg-background min-h-screen max-w-4xl mx-auto">
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof OrgSettingsForm>;

export const Default: Story = {};
