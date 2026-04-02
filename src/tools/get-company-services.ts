import { apiGet, resolveServiceId } from '../lib/api.js';
import { cacheGet, cacheSet } from '../lib/cache.js';

interface Service {
  id: number;
  abstractServiceId: number;
  name: string;
  [key: string]: unknown;
}

export async function getCompanyServices(slug: string): Promise<string> {
  const cacheKey = `services:${slug}`;
  const cached = cacheGet(cacheKey);
  if (cached) return JSON.stringify(cached);

  const data = await apiGet<Service[]>(`/api/companies/${slug}/services`);

  const enriched = data.map((service) => ({
    ...service,
    _resolvedServiceId: resolveServiceId(service as unknown as Record<string, unknown>),
  }));

  cacheSet(cacheKey, enriched, 300);
  return JSON.stringify(enriched);
}
