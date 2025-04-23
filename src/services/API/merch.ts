import { baseUrl } from "./base-url";

export async function getMerch(tokenFromReducer: string, merchName?: string) {
  let url = `${baseUrl}/merch?pageNumber=1&pageSize=99`;

  if (merchName) {
    url += `&filter=${merchName}`;
  }

  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}
export async function getMerchCategory(tokenFromReducer: string) {
  const response = await fetch(`${baseUrl}/merchcategories`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}

export async function addMerchToCard(tokenFromReducer: string, id: string, color: string | undefined, size: string) {
  let url = `${baseUrl}/merch/${id}/add-to-cart?size=${size}`;
  if (color) {
    url += `&color=${color}`;
  }

  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}

export async function deleteMerchToCard(tokenFromReducer:string, id:string, color: string, size: string, removeAll: boolean){
  const response = await fetch(`${baseUrl}/merch/cart/${id}?removeAll=${removeAll}&color=${color}&size=${size}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json()
}

export async function getMerchCartItems(tokenFromReducer: string){
  const response = await fetch (`${baseUrl}/merch/cart/my`,{
    method: 'get',
    headers:{
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    }
  })
  return response.json()
}

export async function getMerchColors(tokenFromReducer: string){
  const response = await fetch (`${baseUrl}/merch/enums/colors`,{
    method: 'get',
    headers:{
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    }
  })
  return response.json()
}

export async function getCdekSities(tokenFromReducer: string, city: string = '') {
  const url = `${baseUrl}/cdek/cities`;

  console.log("Requesting:", url); // Debug URL
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    }
  });
  return response.json();
}


export async function createOrder(tokenFromReducer: string, data: any){
  const response = await fetch (`${baseUrl}/merch/orders`,{
    method: 'post',
    headers:{
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    },
    body: JSON.stringify(data)
  })

  return response.json()
}



export async function getMyOrders(tokenFromReducer: string){
  const response = await fetch (`${baseUrl}/merch/orders/my?pageNumber=1&pageSize=999`,{
    method: 'get',
    headers:{
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    },
  })

  return response.json()
}


export async function getSingleOrderInfo(tokenFromReducer: string, id: string | number){
  const response = await fetch (`${baseUrl}/cdek/delivery/${id}`,{
    method: 'get',
    headers:{
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    },
  })

  return response.json()
}


export async function getSingleOrderFullData(tokenFromReducer: string, id: string | number){
  const response = await fetch (`${baseUrl}/merch/orders/${id}`,{
    method: 'get',
    headers:{
      "Content-Type": "application/json",
      'Authorization': "Bearer " + tokenFromReducer
    },
  })

  return response.json()
}


