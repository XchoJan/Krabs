import { baseUrl } from "./base-url";

export async function sendPin(pin: string, number: string) {
  const response = await fetch(`${baseUrl}/authorization/user/confirmation-code`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      "phone": number,
      "code": pin,
    })
  });
  return response.json();
}

export async function sendPinFromUpdateAccountPhone(tokenFromReducer: string, phone: string, code: string) {
  const response = await fetch(`${baseUrl}/users/phone/confirmation-code`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
    body: JSON.stringify({
      phone: phone,
      code: code
    })
  });
  return response.json();
}
