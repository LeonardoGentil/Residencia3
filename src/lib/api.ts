import axios from 'axios';
import { BASE_HEADERS, WRITE_HEADERS } from './headers.js';

const BASE_URL = process.env.FILAZERO_API_URL ?? 'https://api.staging.filazero.net';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

function checkApiErrors(response: Record<string, unknown>): void {
  const messages = response.messages;
  if (Array.isArray(messages) && messages.length > 0) {
    const errors = messages.filter((m: Record<string, unknown>) => m['type'] === 'ERROR');
    if (errors.length > 0) {
      const first = errors[0] as Record<string, unknown>;
      throw new Error(String(first['description'] ?? 'Erro desconhecido da API'));
    }
  }
}

export function resolveServiceId(service: Record<string, unknown>): number {
  const abstractId = service['abstractServiceId'];
  if (typeof abstractId === 'number' && abstractId > 0) return abstractId;
  return service['id'] as number;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = { ...BASE_HEADERS };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await client.get<T>(path, { headers });
  checkApiErrors(response.data as Record<string, unknown>);
  return response.data;
}

export async function apiPost<T>(path: string, body: unknown, token: string): Promise<T> {
  const headers: Record<string, string> = {
    ...WRITE_HEADERS,
    'Authorization': `Bearer ${token}`,
  };

  const response = await client.post<T>(path, body, { headers });
  checkApiErrors(response.data as Record<string, unknown>);
  return response.data;
}
