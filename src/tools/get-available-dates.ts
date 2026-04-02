import { apiGet } from '../lib/api.js';

export async function getAvailableDates(
  slug: string,
  serviceId: number,
  year: number,
  month: number
): Promise<string> {
  const path = `/v2/scheduling/self-service/providers/${slug}/services/${serviceId}/available-session-days?year=${year}&month=${month}`;
  const data = await apiGet<unknown>(path);
  return JSON.stringify(data);
}
