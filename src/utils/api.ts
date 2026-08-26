const API_TIMEOUT = 10000;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
    const resp = await fetch("/api/health", { signal: controller.signal });
    clearTimeout(timeout);
    return resp.ok;
  } catch {
    return false;
  }
}

export async function fetchWithFallback<T>(
  url: string,
  options?: RequestInit,
  fallback?: T
): Promise<{ data: T | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
    const resp = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return { data: fallback ?? null, error: `HTTP ${resp.status}` };
    }

    const data = await resp.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { data: fallback ?? null, error: message };
  }
}
