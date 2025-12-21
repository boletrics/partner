// Re-export all auth-related exports for convenience
export { authClient } from "./authClient";
export type { AuthClient } from "./authClient";

export {
	getAuthCoreBaseUrl,
	getAuthAppUrl,
	getAuthEnvironment,
} from "./authCoreConfig";

export { getServerSession, hasSessionCookie } from "./getServerSession";
export type { ServerSession } from "./getServerSession";

export {
	sessionStore,
	setSession,
	clearSession,
	setSessionPending,
	setSessionError,
	createSessionStore,
} from "./sessionStore";
export type { SessionStore } from "./sessionStore";

export {
	useAuthSession,
	SessionHydrator,
	AuthSessionProvider,
	createSessionStore as createAuthSessionStore,
} from "./useAuthSession";
export type { SessionStore as AuthSessionStore } from "./useAuthSession";

export {
	signIn,
	signUp,
	signOut,
	recoverPassword,
	resetPassword,
} from "./authActions";

export {
	getDefaultRedirectUrl,
	getAuthRedirectUrl,
	getAuthLoginUrl,
} from "./redirectConfig";

export type {
	Session,
	SessionUser,
	SessionData,
	SessionSnapshot,
	SignInCredentials,
	SignUpCredentials,
	AuthResult,
} from "./types";
