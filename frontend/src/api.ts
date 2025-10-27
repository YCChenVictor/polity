// api.ts (no "any")
const API = process.env.REACT_APP_BACKEND_URL ?? "";

export type ApiResult<T = unknown> =
  | { ok: true; status: number; data: T; headers: Headers }
  | {
      ok: false;
      status: number;
      error: string;
      body?: unknown;
      headers: Headers;
    };

export interface ApiOpts {
  timeoutMs?: number;
  on401?: () => void;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function mergeJsonHeaders(h?: HeadersInit): Headers {
  const headers = new Headers(h);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  return headers;
}

export async function api<T>(
  path: string,
  init?: RequestInit,
  opts?: ApiOpts,
): Promise<ApiResult<T>> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), opts?.timeoutMs ?? 15000);

  try {
    const res = await fetch(API + path, {
      credentials: "include",
      headers: mergeJsonHeaders(init?.headers),
      signal: ctl.signal,
      ...init,
    });

    const is204 = res.status === 204;
    const ctype = res.headers.get("content-type") ?? "";
    const body: unknown = is204
      ? undefined
      : ctype.includes("application/json")
        ? await res.json().catch<unknown>(() => undefined)
        : await res.text().catch<unknown>(() => undefined);

    if (res.ok) {
      return {
        ok: true,
        status: res.status,
        data: (body as T) ?? (undefined as T),
        headers: res.headers,
      };
    }

    if (res.status === 401) opts?.on401?.();
    const error =
      (isRecord(body) && typeof body.error === "string" && body.error) ||
      (typeof body === "string" ? body : res.statusText);

    return { ok: false, status: res.status, error, body, headers: res.headers };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "network error";
    return { ok: false, status: 0, error: msg, headers: new Headers() };
  } finally {
    clearTimeout(t);
  }
}

// helpers (no "any")
export const getJSON = <T>(
  path: string,
  init?: Omit<RequestInit, "method" | "body">,
  opts?: ApiOpts,
) => api<T>(path, { ...init, method: "GET" }, opts);

export const postJSON = <T, B = unknown>(
  path: string,
  body: B,
  init?: Omit<RequestInit, "method" | "body">,
  opts?: ApiOpts,
) =>
  api<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }, opts);
