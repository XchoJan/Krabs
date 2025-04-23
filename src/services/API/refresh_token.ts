import { baseUrl } from "./base-url";

export async function RefreshToken(tokenFromReducer: string) {
  try {
    const response = await fetch(`${baseUrl}/authorization/refresh-token`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': "refreshToken=" + tokenFromReducer
      },
      body: JSON.stringify({
        accessToken: tokenFromReducer
      })
    });

    return response.json();
  }catch (e){
    console.log(e, 'REFRESH TOKEN ERROR');
  }
}
