import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAuthServiceUrl, getAuthAppUrl } from "./config";

describe("config", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		// Reset environment variables
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe("getAuthServiceUrl", () => {
		it("should return default URL when env var is not set", () => {
			delete process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
			const url = getAuthServiceUrl();
			expect(url).toBe("https://auth-svc.example.workers.dev");
		});

		it("should return env var URL when set", () => {
			process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = "https://custom-auth-svc.com";
			const url = getAuthServiceUrl();
			expect(url).toBe("https://custom-auth-svc.com");
		});
	});

	describe("getAuthAppUrl", () => {
		it("should return default URL when env var is not set", () => {
			delete process.env.NEXT_PUBLIC_AUTH_APP_URL;
			const url = getAuthAppUrl();
			expect(url).toBe("https://auth.example.workers.dev");
		});

		it("should return env var URL when set", () => {
			process.env.NEXT_PUBLIC_AUTH_APP_URL = "https://custom-auth-app.com";
			const url = getAuthAppUrl();
			expect(url).toBe("https://custom-auth-app.com");
		});
	});
});
