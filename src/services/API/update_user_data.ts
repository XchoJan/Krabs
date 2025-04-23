import { baseUrl } from "./base-url";

export async function updateUserPhoto(image: any, tokenFromReducer: string) {
  const form = new FormData()
  form.append('photo', image)


  const response = await fetch(`${baseUrl}/users/photo`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'accept': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
    body: form
  });
  console.log(response, 'update photo');
  return response.json();
}
export async function updateUserNameAndEmail(fio: string, email: string, fieldOfActivity: any, tokenFromReducer: string) {
  const trimmedEmail = email.trim();
  const response = await fetch(`${baseUrl}/users/name-and-email`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
    body: JSON.stringify({
      name: fio,
      email: trimmedEmail,
      fieldOfActivity: fieldOfActivity
    })
  });
  return response.json();
}
export async function updateUserPhone(tokenFromReducer: string, phone: string) {
  const response = await fetch(`${baseUrl}/users/phone`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
    body: JSON.stringify({
      phone: phone
    })
  });
  return response.json();
}

export async function deleteUserAccount(tokenFromReducer: string) {
  const response = await fetch(`${baseUrl}/users/me`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}

export async function getFieldOfActivity(tokenFromReducer: string) {
  const response = await fetch(`${baseUrl}/users/fieldOfActivityInfo`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}
