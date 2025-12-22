import { describe, it, expect, beforeEach } from "vitest";
import { sessionStore, setSession, clearSession } from "./sessionStore";
import type { Session } from "./types";

describe("sessionStore", () => {
	beforeEach(() => {
		// Reset store to initial state before each test
		sessionStore.set({
			data: null,
			error: null,
			isPending: true,
		});
	});

	it("should initialize with null session and pending state", () => {
		const state = sessionStore.get();
		expect(state.data).toBeNull();
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(true);
	});

	it("should set session data correctly", () => {
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

		const state = sessionStore.get();
		expect(state.data).toEqual(mockSession);
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(false);
	});

	it("should clear session data correctly", () => {
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
		clearSession();

		const state = sessionStore.get();
		expect(state.data).toBeNull();
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(false);
	});

	it("should handle null session", () => {
		setSession(null);

		const state = sessionStore.get();
		expect(state.data).toBeNull();
		expect(state.error).toBeNull();
		expect(state.isPending).toBe(false);
	});
});
