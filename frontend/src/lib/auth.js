import { loginRequest } from "./api";

const STORAGE_KEY = "user";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUserSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearUserSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function parseJwt(token) {
  const payload = token.split(".")[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(normalized));
}

export async function loginAndStoreUser(email, password) {
  const tokenData = await loginRequest(email, password);
  const payload = parseJwt(tokenData.access_token);
  const session = {
    token: tokenData.access_token,
    token_type: tokenData.token_type,
    user_id: payload.id,
    email: payload.email,
    role: payload.role === 1 ? "admin" : "user",
    role_id: payload.role,
  };
  storeUserSession(session);
  return session;
}
