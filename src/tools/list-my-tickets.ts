import { apiGet } from '../lib/api.js';

export async function listMyTickets(token: string): Promise<string> {
  const data = await apiGet<unknown>('/v2/ticketing/me/filtered-tickets', token);
  return JSON.stringify(data);
}
