import { create } from "zustand";

export type NavigationView =
	| "dashboard"
	| "events"
	| "events-new"
	| "events-drafts"
	| "orders"
	| "scan"
	| "refunds"
	| "customers"
	| "analytics"
	| "finance"
	| "finance-transactions"
	| "finance-payouts"
	| "team"
	| "settings"
	| "help";

interface NavigationState {
	currentView: NavigationView;
	setView: (view: NavigationView) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
	currentView: "dashboard",
	setView: (view) => set({ currentView: view }),
}));
