import { apiGet } from '../lib/api.js';

export async function getBookingForm(
  providerId: number,
  sessionId: number
): Promise<string> {
  const path = `/api/providers/${providerId}/sessions/${sessionId}/custom-fields`;
  const data = await apiGet<unknown>(path);
  return JSON.stringify(data);
}
