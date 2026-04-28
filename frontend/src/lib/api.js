const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

function buildHeaders({ token, contentType = "application/json", extraHeaders = {} } = {}) {
  const headers = { ...extraHeaders };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest(path, options = {}) {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: buildHeaders({
      token,
      contentType: headers?.["Content-Type"] ?? "application/json",
      extraHeaders: headers,
    }),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail = typeof data === "object" && data?.detail ? data.detail : "Request failed";
    throw new Error(detail);
  }

  return data;
}

export async function loginRequest(email, password) {
  const body = new URLSearchParams({
    username: email,
    password,
  });

  return apiRequest("/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

export { API_BASE_URL };
