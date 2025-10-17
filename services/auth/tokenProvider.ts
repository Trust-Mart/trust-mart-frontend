// Simple, SSR-safe token provider abstraction.
// Uses localStorage in the browser; on the server it becomes a no-op.

const isBrowser = typeof window !== "undefined";

const ACCESS_TOKEN_KEY = "tm_access_token";

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore storage failures
  }
}

export function clearAccessToken(): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore storage failures
  }
}

export function hasAccessToken(): boolean {
  return !!getAccessToken();
}


