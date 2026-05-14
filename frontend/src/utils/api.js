const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const CACHE_PREFIX = "fuji-api-cache:";

export const API_URL = API_BASE_URL;
export const API_ROOT = `${API_BASE_URL}/api`;

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiPath = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_ROOT}${normalizedPath}`;
};

export const cacheTtl = {
  short: 60 * 1000,
  medium: 5 * 60 * 1000,
  long: 15 * 60 * 1000,
};

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (!cached.expiresAt || Date.now() > cached.expiresAt) {
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = (key, data, ttl) => {
  try {
    sessionStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({
        data,
        expiresAt: Date.now() + ttl,
      })
    );
  } catch {
    // Storage can be full or disabled; fetching still works without cache.
  }
};

export const cachedJsonFetch = async (url, options = {}) => {
  const {
    ttl = cacheTtl.medium,
    cacheKey = url,
    forceRefresh = false,
    ...fetchOptions
  } = options;

  if (!forceRefresh) {
    const cached = readCache(cacheKey);
    if (cached !== null) return cached;
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  writeCache(cacheKey, data, ttl);
  return data;
};
