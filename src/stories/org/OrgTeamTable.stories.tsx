import type { Meta, StoryObj } from "@storybook/react";
import { OrgTeamTable } from "@/components/org/org-team-table";

const meta: Meta<typeof OrgTeamTable> = {
	title: "Blocks/Partner/OrgTeamTable",
	component: OrgTeamTable,
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

type Story = StoryObj<typeof OrgTeamTable>;

export const Default: Story = {};
