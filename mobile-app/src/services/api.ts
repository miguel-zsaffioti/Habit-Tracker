const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

let _token: string | null = null;

export function setApiToken(token: string | null) {
  console.log('[API] setApiToken called, token exists:', !!token, token ? token.substring(0, 20) + '...' : 'null');
  _token = token;
}

export function getApiToken() {
  return _token;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers } = options;

  const authHeaders: Record<string, string> = {};
  if (_token) {
    authHeaders['Authorization'] = `Bearer ${_token}`;
  }
  console.log(`[API] ${method} ${path} | token exists: ${!!_token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    let message: string;
    if (typeof error.detail === 'string') {
      message = error.detail;
    } else if (Array.isArray(error.detail)) {
      message = error.detail.map((e: any) => e.msg).join('; ');
    } else {
      message = `Erro ${res.status}`;
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
