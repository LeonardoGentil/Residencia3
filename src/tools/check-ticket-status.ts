import { apiGet } from '../lib/api.js';

export async function checkTicketStatus(accessKey: string): Promise<string> {
  const path = `/v2/ticketing/public/ticket?key=${accessKey}`;
  const data = await apiGet<unknown>(path);
  return JSON.stringify(data);
}
