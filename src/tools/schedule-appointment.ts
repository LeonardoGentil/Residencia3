import { apiPost } from '../lib/api.js';

interface SchedulePayload {
  sessionId: number;
  serviceId: number;
  locationId: number;
  customFields?: Record<string, unknown>;
}

export async function scheduleAppointment(
  payload: SchedulePayload,
  token: string
): Promise<string> {
  const data = await apiPost<unknown>('/v2/ticketing/tickets', payload, token);
  return JSON.stringify(data);
}
