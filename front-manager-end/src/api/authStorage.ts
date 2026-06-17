const TOKEN_KEY = "knowledge_manager_token";
const USER_KEY = "knowledge_manager_user";
const AUTH_EXPIRED_EVENT = "knowledge_manager_auth_expired";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function notifyAuthenticationExpired() {
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

export function subscribeAuthenticationExpired(listener: () => void) {
  window.addEventListener(AUTH_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
}
