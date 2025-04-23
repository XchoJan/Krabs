import { baseUrl } from "./base-url";

export async function sentCounterfeit(data: any, tokenFromReducer: string) {
  console.log(data, "DATA");
  const response = await fetch(`${baseUrl}/messages`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
      "Authorization": "Bearer " + tokenFromReducer,
    },
    body: JSON.stringify({
      product: data.product,
      city: data.city,
      text: data.text,
    }),
  });
  return response.json();
}

export async function sentCounterfeitPhoto(images: any, tokenFromReducer: string, id: string) {
  let form = new FormData();
  images.forEach((item: any) => {
    form.append(`photo`, {
      uri: item.uri,
      type: item.type,
      name: item.name + Math.random() * 8000 + `.JPG`,
      id: Date.now() + Math.random() * 8000,
    });
  });

  try {
    const response =  await fetch(`${baseUrl}/messages/${id}/photo`, {
      method: "post",
      headers: {
        "Authorization": "Bearer " + tokenFromReducer,
        "Content-Type": "multipart/form-data",
      },
      body: form,
    });
    return response.json()
  } catch (e) {
    console.log(e);
  }
}

export async function getProductNames(tokenFromReducer:string){
  try {
    const response = await fetch(`${baseUrl}/products/names`,{
      method: 'get',
      headers: {
        "Authorization": "Bearer " + tokenFromReducer,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.json()
  }catch (e){
    console.log(e, 'ERROR GET PRODUCT NAMES')
  }
}
