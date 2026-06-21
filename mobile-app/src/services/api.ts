const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(error.detail ?? `Erro ${res.status}`);
  }

  return res.json() as Promise<T>;
}
