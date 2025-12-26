import type { Meta, StoryObj } from "@storybook/react";
import { OrgHeader } from "@/components/org/org-header";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta: Meta<typeof OrgHeader> = {
	title: "Blocks/Partner/OrgHeader",
	component: OrgHeader,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<SidebarProvider>
				<div className="min-h-[100px]">
					<Story />
				</div>
			</SidebarProvider>
		),
	],
};

export default meta;

type Story = StoryObj<typeof OrgHeader>;

export const Default: Story = {};
