import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionHydrator, useAuthSession } from "./useAuthSession";
import { sessionStore, setSession } from "./sessionStore";
import type { Session } from "./types";

// Mock nanostores/react
vi.mock("@nanostores/react", () => ({
	useStore: vi.fn((store) => store.get()),
}));

describe("useAuthSession", () => {
	beforeEach(() => {
		sessionStore.set({
			data: null,
			error: null,
			isPending: true,
		});
	});

	it("should return session state from store", () => {
		const mockSession: Session = {
			user: {
				id: "123",
				name: "Test User",
				email: "test@example.com",
				image: null,
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			session: {
				id: "session-123",
				userId: "123",
				token: "token-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		setSession(mockSession);
		const result = useAuthSession();

		expect(result.data).toEqual(mockSession);
		expect(result.error).toBeNull();
		expect(result.isPending).toBe(false);
	});

	it("should return pending state when session is loading", () => {
		const result = useAuthSession();
		expect(result.data).toBeNull();
		expect(result.isPending).toBe(true);
	});
});

describe("SessionHydrator", () => {
	const mockSession: Session = {
		user: {
			id: "123",
			name: "Test User",
			email: "test@example.com",
			image: null,
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		session: {
			id: "session-123",
			userId: "123",
			token: "token-123",
			expiresAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	};

	beforeEach(() => {
		// Mock window object
		Object.defineProperty(window, "window", {
			value: window,
			writable: true,
		});
		sessionStore.set({
			data: null,
			error: null,
			isPending: true,
		});
	});

	it("should hydrate session store on mount", () => {
		render(
			<SessionHydrator serverSession={mockSession}>
				<div>Test Content</div>
			</SessionHydrator>,
		);

		const state = sessionStore.get();
		expect(state.data).toEqual(mockSession);
		expect(state.isPending).toBe(false);
		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("should render children", () => {
		render(
			<SessionHydrator serverSession={mockSession}>
				<div>Child Content</div>
			</SessionHydrator>,
		);

		expect(screen.getByText("Child Content")).toBeInTheDocument();
	});

	it("should handle null session", () => {
		render(
			<SessionHydrator serverSession={null}>
				<div>Test Content</div>
			</SessionHydrator>,
		);

		const state = sessionStore.get();
		expect(state.data).toBeNull();
		expect(state.isPending).toBe(false);
	});
});
