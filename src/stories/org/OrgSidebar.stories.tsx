import type { Meta, StoryObj } from "@storybook/react";
import { OrgSidebar } from "@/components/org/org-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta: Meta<typeof OrgSidebar> = {
	title: "Blocks/Partner/OrgSidebar",
	component: OrgSidebar,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/",
			},
		},
	},
	decorators: [
		(Story) => (
			<SidebarProvider defaultOpen>
				<div className="flex min-h-screen">
					<Story />
				</div>
			</SidebarProvider>
		),
	],
};

export default meta;

type Story = StoryObj<typeof OrgSidebar>;

export const Default: Story = {};

export const Collapsed: Story = {
	decorators: [
		(Story) => (
			<SidebarProvider defaultOpen={false}>
				<div className="flex min-h-screen">
					<Story />
				</div>
			</SidebarProvider>
		),
	],
};
