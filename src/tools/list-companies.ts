import { apiGet } from '../lib/api.js';
import { cacheGet, cacheSet } from '../lib/cache.js';

const TTL = Number(process.env.CACHE_TTL_COMPANIES ?? 300);

export async function listCompanies(): Promise<string> {
  const cacheKey = 'companies:all';
  const cached = cacheGet(cacheKey);
  if (cached) return JSON.stringify(cached);

  const data = await apiGet<unknown[]>('/api/companies');
  cacheSet(cacheKey, data, TTL);

  return JSON.stringify(data);
}
