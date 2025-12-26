import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetcher, buildQueryString, getAuthToken, apiFetch } from "../client";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock auth
vi.mock("../../auth/authClient", () => ({
	getClientJwt: vi.fn().mockResolvedValue(null),
}));

describe("Partner API Client", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetcher", () => {
		it("should call fetch with the correct URL", async () => {
			const mockResponse = { data: "test" };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => mockResponse,
			});

			const result = await fetcher("/test-endpoint");

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("/test-endpoint"),
				expect.objectContaining({
					headers: expect.any(Object),
				}),
			);
			expect(result).toEqual(mockResponse);
		});

		it("should throw an error when response is not ok", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({
					errors: [{ message: "Server error", code: 500 }],
				}),
			});

			await expect(fetcher("/test-endpoint")).rejects.toThrow();
		});

		it("should include Accept header", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({}),
			});

			await fetcher("/test-endpoint");

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Accept: "application/json",
					}),
				}),
			);
		});
	});

	describe("buildQueryString", () => {
		it("should return empty string for empty params", () => {
			expect(buildQueryString({})).toBe("");
		});

		it("should build query string from params", () => {
			const result = buildQueryString({
				page: 1,
				limit: 10,
				search: "test",
			});

			expect(result).toBe("?page=1&limit=10&search=test");
		});

		it("should skip undefined and null values", () => {
			const result = buildQueryString({
				page: 1,
				limit: undefined,
				search: null,
			});

			expect(result).toBe("?page=1");
		});
	});

	describe("getAuthToken", () => {
		it("should return null when no token is stored", () => {
			expect(getAuthToken()).toBeNull();
		});
	});

	describe("apiFetch", () => {
		it("should add JWT to Authorization header when provided", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: {
					get: () => "application/json",
				},
				json: async () => ({ data: "test" }),
			});

			await apiFetch("/test-endpoint", { jwt: "test-jwt-token" });

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Bearer test-jwt-token",
					}),
				}),
			);
		});
	});
});
