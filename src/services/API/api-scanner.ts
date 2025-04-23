import { baseUrl } from "./base-url";

export async function sendScannedQr(tokenFromReducer: string, data: string) {
  const response = await fetch(`${baseUrl}/qr/scans`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
    body: JSON.stringify({
      code: data
    })
  });
  return response.json();
}
export async function getBonusesHistory(tokenFromReducer: string, ) {
  const response = await fetch(`${baseUrl}/qr/scans/history?pageNumber=1&pageSize=90`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}
