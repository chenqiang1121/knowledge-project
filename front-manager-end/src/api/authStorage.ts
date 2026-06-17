const TOKEN_KEY = "knowledge_manager_token";
const USER_KEY = "knowledge_manager_user";
const AUTH_EXPIRED_EVENT = "knowledge_manager_auth_expired";

export class AuthStorage {
  static getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static setStoredToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getStoredUser() {
    return localStorage.getItem(USER_KEY);
  }

  static setStoredUser(user: unknown) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static notifyAuthenticationExpired() {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  static subscribeAuthenticationExpired(listener: () => void) {
    window.addEventListener(AUTH_EXPIRED_EVENT, listener);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
  }
}
