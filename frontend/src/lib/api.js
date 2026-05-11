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

function formatDetail(detail) {
  if (!detail) {
    return "Request failed";
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.msg) {
          const location = Array.isArray(item.loc)
            ? item.loc.filter((part) => part !== "body").join(".")
            : "";
          return location ? `${location}: ${item.msg}` : item.msg;
        }
        return formatDetail(item);
      })
      .filter(Boolean)
      .join(" ");
  }

  if (typeof detail === "object") {
    if (detail.message) return formatDetail(detail.message);
    if (detail.error) return formatDetail(detail.error);
    return Object.entries(detail)
      .map(([key, value]) => `${key}: ${formatDetail(value)}`)
      .join(" ");
  }

  return String(detail);
}

export async function apiRequest(path, options = {}) {
  const { token, headers, ...rest } = options;
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders({
        token,
        contentType: headers?.["Content-Type"] ?? "application/json",
        extraHeaders: headers,
      }),
    });
  } catch (requestError) {
    const error = new Error(
      "The backend server could not be reached. Please confirm it is running and try again."
    );
    error.cause = requestError;
    throw error;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail = typeof data === "object" && data?.detail ? data.detail : data;
    const error = new Error(formatDetail(detail));
    error.status = response.status;
    error.data = data;
    throw error;
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
