export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchJson<T>(
  path: string,
  init: RequestInit = { cache: "no-store" },
): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return (await res.json()) as T;
}
