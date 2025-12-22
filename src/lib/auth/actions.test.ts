import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logout } from "./actions";

// Mock dependencies - must use factory functions
vi.mock("./sessionStore", () => ({
	clearSession: vi.fn(),
}));

vi.mock("./authClient", () => ({
	authClient: {
		signOut: vi.fn(),
	},
}));

vi.mock("./config", () => ({
	getAuthAppUrl: vi.fn(() => "https://auth.example.com"),
}));

describe("logout", () => {
	const mockWindowLocation = { href: "" };
	let mockClearSession: ReturnType<typeof vi.fn>;
	let mockSignOut: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.clearAllMocks();
		// Mock window.location
		Object.defineProperty(window, "location", {
			value: mockWindowLocation,
			writable: true,
		});
		mockWindowLocation.href = "";

		// Get mocked functions
		const { clearSession } = await import("./sessionStore");
		const { authClient } = await import("./authClient");
		mockClearSession = vi.mocked(clearSession);
		mockSignOut = vi.mocked(authClient.signOut);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should clear session and redirect on successful signOut", async () => {
		mockSignOut.mockImplementation((options) => {
			// Simulate onSuccess callback being called
			if (options?.fetchOptions?.onSuccess) {
				options.fetchOptions.onSuccess();
			}
			return Promise.resolve(undefined);
		});

		await logout();

		expect(mockClearSession).toHaveBeenCalled();
		expect(mockWindowLocation.href).toBe("https://auth.example.com/login");
	});

	it("should clear session and redirect even if signOut fails", async () => {
		mockSignOut.mockRejectedValue(new Error("Sign out failed"));

		await logout();

		expect(mockClearSession).toHaveBeenCalled();
		expect(mockWindowLocation.href).toBe("https://auth.example.com/login");
	});

	it("should use onSuccess callback when provided", async () => {
		mockSignOut.mockImplementation((options) => {
			if (options?.fetchOptions?.onSuccess) {
				options.fetchOptions.onSuccess();
			}
			return Promise.resolve(undefined);
		});

		await logout();

		expect(mockClearSession).toHaveBeenCalled();
		expect(mockWindowLocation.href).toBe("https://auth.example.com/login");
	});
});
