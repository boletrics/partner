import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "./getServerSession";
import { getAuthServiceUrl, getAuthAppUrl } from "./config";

// Mock Next.js cookies
const mockCookies = vi.fn();
vi.mock("next/headers", () => ({
	cookies: () => mockCookies(),
}));

vi.mock("./config", () => ({
	getAuthServiceUrl: vi.fn(() => "https://auth-svc.example.com"),
	getAuthAppUrl: vi.fn(() => "https://auth-app.example.com"),
}));

describe("getServerSession", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = mockFetch;
	});

	it("should return null when no session cookie exists", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "other-cookie=value",
		});

		const result = await getServerSession();
		expect(result).toBeNull();
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("should return null when fetch fails", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockRejectedValue(new Error("Network error"));

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("should return null when response is not ok", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: false,
			status: 401,
		});

		const result = await getServerSession();
		expect(result).toBeNull();
	});

	it("should return session data when valid", async () => {
		const mockSession = {
			user: {
				id: "123",
				name: "Test User",
				email: "test@example.com",
				image: null,
				emailVerified: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			session: {
				id: "session-123",
				userId: "123",
				token: "token-123",
				expiresAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		};

		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => mockSession,
		});

		const result = await getServerSession();

		expect(mockFetch).toHaveBeenCalledWith(
			`${getAuthServiceUrl()}/api/auth/get-session`,
			{
				headers: {
					Cookie: "better-auth.session_token=token123",
					Origin: getAuthAppUrl(),
				},
				cache: "no-store",
			},
		);
		expect(result).not.toBeNull();
		expect(result?.user.id).toBe("123");
		expect(result?.session.id).toBe("session-123");
	});

	it("should return null when session or user is missing", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ user: null, session: null }),
		});

		const result = await getServerSession();
		expect(result).toBeNull();
	});
});
