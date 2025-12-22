import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJwt } from "./getJwt";
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

describe("getJwt", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = mockFetch;
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("should return null when no session cookie exists", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "other-cookie=value",
		});

		const result = await getJwt();
		expect(result).toBeNull();
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("should proceed with __Secure cookie when regular cookie doesn't exist", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "__Secure-better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ token: "jwt-token-123" }),
		});

		const result = await getJwt();
		expect(result).toBe("jwt-token-123"); // Should proceed with __Secure cookie
		expect(mockFetch).toHaveBeenCalled();
	});

	it("should return null when fetch fails", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockRejectedValue(new Error("Network error"));

		const result = await getJwt();
		expect(result).toBeNull();
		expect(console.error).toHaveBeenCalled();
	});

	it("should return null when response is not ok", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
		});

		const result = await getJwt();
		expect(result).toBeNull();
		expect(console.error).toHaveBeenCalled();
	});

	it("should return JWT token when valid", async () => {
		const mockToken = "jwt-token-123";

		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ token: mockToken }),
		});

		const result = await getJwt();

		expect(mockFetch).toHaveBeenCalledWith(
			`${getAuthServiceUrl()}/api/auth/token`,
			{
				headers: {
					Cookie: "better-auth.session_token=token123",
					Origin: getAuthAppUrl(),
					Accept: "application/json",
				},
				cache: "no-store",
			},
		);
		expect(result).toBe(mockToken);
	});

	it("should return null when token is missing from response", async () => {
		mockCookies.mockResolvedValue({
			toString: () => "better-auth.session_token=token123",
		});
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({}),
		});

		const result = await getJwt();
		expect(result).toBeNull();
	});
});
