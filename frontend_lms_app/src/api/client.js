//
// DigitalT3 LMS API Client
// Provides: environment-based API base URL logic, secure fetch wrappers with timeout, standardized error/retry, and auth session token support via Supabase.
// Also provides mock API fallback endpoints for modules, projects, and submissions to keep UI functional until backend exists.
// (c) DigitalT3 © 2024
//

import { supabase } from "../supabaseClient";

/**
 * Gets the API base URL from env vars
 * - Uses REACT_APP_API_BASE, then REACT_APP_BACKEND_URL, then empty string.
 */
function getApiBaseUrl() {
  // Public API: never hardcode secrets. Only read env.
  const apiBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";
  return apiBase.replace(/\/+$/, ""); // Remove trailing slash for consistency.
}

// Timeout for fetch calls (ms)
const DEFAULT_TIMEOUT = 12000;

/**
 * Wait utility with Promise & abort support.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Helper: Implements exponential backoff and retry for fetch calls.
 * Retries on network errors and 5xx responses.
 */
async function fetchWithRetry(
  fetchCall,
  { retries = 2, backoffBase = 400, timeout = DEFAULT_TIMEOUT } = {}
) {
  let attempt = 0;
  let lastError;
  for (; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const to = setTimeout(() => controller.abort(), timeout);

      const resp = await fetchCall({ signal: controller.signal });
      clearTimeout(to);

      if (!resp.ok && resp.status >= 500) {
        throw new Error(
          `Server error (${resp.status}): ${resp.statusText || "Unknown"}`
        );
      }
      return resp;
    } catch (err) {
      lastError = err;
      // AbortError on timeout, TypeError for network fail
      if (
        (err.name === "AbortError" ||
          err.name === "TypeError" ||
          (err.message && err.message.match(/^Server error/))) &&
        attempt < retries
      ) {
        await wait(Math.pow(2, attempt) * backoffBase);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// PUBLIC_INTERFACE
/**
 * Standardized API call wrapper.
 * Injects Auth header if logged in (Supabase JWT), standardizes errors, validates response if schema provided.
 * @param {string} endpoint - API route, e.g. "/modules"
 * @param {"GET"|"POST"|"PUT"|"DELETE"} [method]
 * @param {object} [opts]
 * @param {object} [opts.body] - If body is present, sent as JSON
 * @param {object} [opts.headers]
 * @param {object} [opts.schema] - If provided, calls validateJsonSchema
 * @param {boolean} [opts.useMock] - If true, uses mock handlers regardless of env
 */
export async function apiRequest(
  endpoint,
  method = "GET",
  opts = {}
) {
  if (!endpoint) throw new Error("API endpoint required");

  // Detect if mock endpoint requested/needed
  if (opts.useMock || shouldUseMock(endpoint)) {
    return mockApiHandler(endpoint, method, opts);
  }

  // Auth: get current JWT from Supabase session (never persisted or stored long term)
  let jwt = null;
  try {
    const sessRes = await supabase.auth.getSession();
    jwt = sessRes.data?.session?.access_token || null;
  } catch (e) {
    jwt = null; // Not fatal
  }

  // Compose full URL
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  // Safe headers
  const headers = Object.assign(
    { Accept: "application/json" },
    opts.headers || {}
  );
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // Main fetch with retry logic
  let resp;
  try {
    resp = await fetchWithRetry(
      ({ signal }) =>
        fetch(url, {
          method,
          headers,
          signal,
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          credentials: "include", // If cookie sessions emerge
        }),
      {
        retries: 2,
        timeout: opts.timeout || DEFAULT_TIMEOUT,
      }
    );
  } catch (error) {
    // Standardize error
    return handleApiError(error, url, method, opts);
  }

  // Attempt strict JSON parse
  let data = null;
  let text = null;
  try {
    text = await resp.text();
    if (text && text.trim()) {
      data = JSON.parse(text);
    } else {
      data = undefined;
    }
  } catch (e) {
    return handleApiError(
      new Error("Invalid JSON in API response"),
      url,
      method,
      opts,
      resp.status
    );
  }

  // Optionally validate response
  if (opts.schema) {
    const valid = validateJsonSchema(data, opts.schema);
    if (!valid) {
      return handleApiError(
        new Error("Response does not match schema"),
        url,
        method,
        opts,
        resp.status
      );
    }
  }

  // 4xx/5xx: standardize error object
  if (!resp.ok) {
    return handleApiError(
      new Error(
        `API error (${resp.status}): ${data?.message || resp.statusText}`
      ),
      url,
      method,
      opts,
      resp.status,
      data
    );
  }

  return data;
}

/**
 * Detects if the endpoint should be handled via mock API for rapid dev/prototyping.
 * @param {string} endpoint
 * @returns {boolean}
 */
function shouldUseMock(endpoint) {
  // If backend env not set, use mock for specified endpoints.
  const missingBackend =
    !process.env.REACT_APP_API_BASE && !process.env.REACT_APP_BACKEND_URL;
  if (!missingBackend) return false;
  const mockable = ["/modules", "/projects", "/submissions", "/dashboard"];
  return mockable.some((x) => endpoint.startsWith(x));
}

/**
 * General handler for API errors to return a standardized response.
 */
function handleApiError(
  error,
  url,
  method,
  opts,
  status = undefined,
  data = undefined
) {
  console.error(
    `[API ERROR] ${method} ${url}:`,
    error.message || error,
    "status:",
    status
  );
  return Promise.reject({
    message: error.message || "Request failed",
    status,
    url,
    method,
    data,
  });
}

/**
 * Minimal in-app JSON schema validation. Only supports type/object/array/required.
 * (It is strongly recommended to use a library like zod or yup in production.)
 * For this code, we do a "basic" validation for sample demo schemas.
 */
function validateJsonSchema(data, schema) {
  if (!schema || typeof schema !== "object") return true;
  if (schema.type === "object") {
    if (typeof data !== "object" || Array.isArray(data) || data === null) {
      return false;
    }
    if (schema.required) {
      for (const req of schema.required) {
        if (!(req in data)) return false;
      }
    }
    if (schema.properties) {
      for (const k of Object.keys(schema.properties)) {
        if (data[k] !== undefined) {
          if (
            !validateJsonSchema(
              data[k],
              schema.properties[k]
            )
          ) {
            return false;
          }
        }
      }
    }
    return true;
  } else if (schema.type === "array") {
    if (!Array.isArray(data)) return false;
    if (schema.items) {
      for (const item of data) {
        if (!validateJsonSchema(item, schema.items)) return false;
      }
    }
    return true;
  } else if (schema.type === "string") {
    return typeof data === "string";
  } else if (schema.type === "number") {
    return typeof data === "number";
  } else if (schema.type === "boolean") {
    return typeof data === "boolean";
  }
  return true; // fallback
}

// --- MOCK API ENDPOINTS (for modules, projects, submissions) ---

/**
 * Handles mock API endpoints; will call the existing service mocks.
 * Returns Promise resolving to mock data.
 */
async function mockApiHandler(endpoint, method, opts) {
  // Import the mocks dynamically to avoid circular import
  const [
    { getEmployeeDashboardData, getAdminDashboardData, getModuleById },
  ] = await Promise.all([
    import("../services/mockLmsData"),
  ]);
  const { saveFile, submitFile } = await import("../services/editorService");

  // Normalize endpoint path (strip base url)
  const path = endpoint.replace(/^https?:\/\/[^/]+/, "");

  // Dashboards
  if (path.startsWith("/dashboard")) {
    // Pick employee/admin based on opts or demo
    if (opts && opts.isAdmin) return getAdminDashboardData();
    return getEmployeeDashboardData();
  }
  // Modules listing
  if (path === "/modules" && method === "GET") {
    const d = await getEmployeeDashboardData();
    return d && d.modules ? d.modules : [];
  }

  // Modules detail
  if (path.startsWith("/modules/")) {
    const moduleId = Number(path.split("/")[2]);
    return getModuleById(moduleId || 103);
  }

  // Projects listing
  if (path.startsWith("/projects")) {
    // Demo: just make projects array up (expand as needed)
    return [
      {
        id: 201,
        title: "RESTful API Challenge",
        description: "Build a minimal RESTful API using Node or Python.",
        status: "pending",
      },
      {
        id: 202,
        title: "Frontend Challenge",
        description: "Implement a dashboard component in React.",
        status: "approved",
      },
    ];
  }
  // Submissions listing (admin review)
  if (path.startsWith("/submissions")) {
    const d = await getAdminDashboardData();
    return d && d.submissions ? d.submissions : [];
  }

  // Editor file save/submit
  if (path.startsWith("/editor/save") && method === "POST") {
    return saveFile(opts.body);
  }
  if (path.startsWith("/editor/submit") && method === "POST") {
    return submitFile(opts.body);
  }

  // Fallback: not found
  return Promise.reject({
    message: "Mock endpoint not found: " + path,
    status: 404,
  });
}
