import { baseUrl } from "./base-url";

export async function getNewsList(tokenFromReducer: string) {
  const response = await fetch(`${baseUrl}/posts`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}
