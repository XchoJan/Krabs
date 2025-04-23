import { baseUrl } from "./base-url";

export async function getUserData(tokenFromReducer: string) {
  const response = await fetch(`${baseUrl}/authorization/user`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}
