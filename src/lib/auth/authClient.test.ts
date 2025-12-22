import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientJwt } from "./authClient";
import { authClient } from "./authClient";

// Mock better-auth/client
vi.mock("better-auth/client", () => ({
	createAuthClient: vi.fn(() => ({
		token: vi.fn(),
		signOut: vi.fn(),
	})),
}));

vi.mock("better-auth/client/plugins", () => ({
	jwtClient: vi.fn(() => ({})),
	organizationClient: vi.fn(() => ({})),
}));

vi.mock("./config", () => ({
	getAuthServiceUrl: vi.fn(() => "https://auth-svc.example.com"),
}));

describe("authClient", () => {
	it("should create auth client with correct configuration", () => {
		expect(authClient).toBeDefined();
	});
});

describe("getClientJwt", () => {
	const mockToken = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "error").mockImplementation(() => {});
		// Mock authClient.token
		Object.defineProperty(authClient, "token", {
			value: mockToken,
			writable: true,
		});
	});

	it("should return JWT token when successful", async () => {
		mockToken.mockResolvedValue({
			data: { token: "jwt-token-123" },
			error: null,
		});

		const result = await getClientJwt();
		expect(result).toBe("jwt-token-123");
		expect(mockToken).toHaveBeenCalled();
	});

	it("should return null when error is present", async () => {
		mockToken.mockResolvedValue({
			data: null,
			error: { message: "Failed to get token" },
		});

		const result = await getClientJwt();
		expect(result).toBeNull();
		expect(console.error).toHaveBeenCalled();
	});

	it("should return null when token is missing", async () => {
		mockToken.mockResolvedValue({
			data: {},
			error: null,
		});

		const result = await getClientJwt();
		expect(result).toBeNull();
		expect(console.error).toHaveBeenCalled();
	});

	it("should return null when exception is thrown", async () => {
		mockToken.mockRejectedValue(new Error("Network error"));

		const result = await getClientJwt();
		expect(result).toBeNull();
		expect(console.error).toHaveBeenCalled();
	});
});
