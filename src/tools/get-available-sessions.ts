import { apiGet } from '../lib/api.js';

export async function getAvailableSessions(
  slug: string,
  locationId: number,
  serviceId: number,
  date: string
): Promise<string> {
  const path = `/v2/scheduling/self-service/providers/${slug}/locations/${locationId}/services/${serviceId}/sessions-resources-by-service?date=${date}`;
  const data = await apiGet<unknown>(path);
  return JSON.stringify(data);
}
