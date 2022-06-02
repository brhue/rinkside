const BASE_URL = "https://statsapi.web.nhl.com/api/v1/";
export async function client(endpoint: string, customConfig: RequestInit = {}) {
  const config = {
    method: "GET",
    ...customConfig,
  };
  const res = await window.fetch(`${BASE_URL}${endpoint}`, config);
  let data = await res.json();
  if (res.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}
