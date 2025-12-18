"use client";

import { useNavigationStore } from "@/lib/navigation-store";
import { OrgDashboardOverview } from "@/components/org/org-dashboard-overview";
import { OrgTeamTable } from "@/components/org/org-team-table";
import { OrgSettingsForm } from "@/components/org/org-settings-form";
import { EventsView } from "@/components/org/views/events-view";
import { EventsNewView } from "@/components/org/views/events-new-view";
import { EventsDraftsView } from "@/components/org/views/events-drafts-view";
import { OrdersView } from "@/components/org/views/orders-view";
import { ScanView } from "@/components/org/views/scan-view";
import { RefundsView } from "@/components/org/views/refunds-view";
import { CustomersView } from "@/components/org/views/customers-view";
import { AnalyticsView } from "@/components/org/views/analytics-view";
import { FinanceView } from "@/components/org/views/finance-view";
import { FinanceTransactionsView } from "@/components/org/views/finance-transactions-view";
import { FinancePayoutsView } from "@/components/org/views/finance-payouts-view";
import { HelpView } from "@/components/org/views/help-view";

export function OrgViewRouter() {
	const { currentView } = useNavigationStore();

	switch (currentView) {
		case "dashboard":
			return <OrgDashboardOverview />;
		case "events":
			return <EventsView />;
		case "events-new":
			return <EventsNewView />;
		case "events-drafts":
			return <EventsDraftsView />;
		case "orders":
			return <OrdersView />;
		case "scan":
			return <ScanView />;
		case "refunds":
			return <RefundsView />;
		case "customers":
			return <CustomersView />;
		case "analytics":
			return <AnalyticsView />;
		case "finance":
			return <FinanceView />;
		case "finance-transactions":
			return <FinanceTransactionsView />;
		case "finance-payouts":
			return <FinancePayoutsView />;
		case "team":
			return (
				<div className="p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold tracking-tight">Equipo</h1>
						<p className="text-muted-foreground">
							Gestiona los miembros y permisos de tu organización
						</p>
					</div>
					<OrgTeamTable />
				</div>
			);
		case "settings":
			return <OrgSettingsForm />;
		case "help":
			return <HelpView />;
		default:
			return <OrgDashboardOverview />;
	}
}
