export const BASE_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://app.filazero.net',
  'Referer': 'https://app.filazero.net/',
  'User-Agent': 'MCP-Server-FilaZero/1.0',
  'DNT': '1',
};

export const WRITE_HEADERS = {
  ...BASE_HEADERS,
  'Content-Type': 'application/json;charset=UTF-8',
};
