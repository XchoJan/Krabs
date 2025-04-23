import { baseUrl } from "./base-url";

export async function getShowRooms(tokenFromReducer: string) {
  const response = await fetch(`${baseUrl}/showrooms?paginationOff=true`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}

export async function getShowRoomById(tokenFromReducer: string, id: string) {
  const response = await fetch(`${baseUrl}/showrooms/${id}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json();
}

export async function getCountriesFromShowRooms(tokenFromReducer: string){
  const response = await fetch(`${baseUrl}/cities/by-showrooms?pageSize=60`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    },
  });
  return response.json()
}

export async function getShowRoomsFromCityName(tokenFromReducer: string, cityName: string){
  const response = await fetch (`${baseUrl}/showrooms/by-city?city=${cityName}`,{
    method: 'get',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    }
  })
  return response.json()
}

export async function getAllDocuments(tokenFromReducer: string){
  const response = await fetch (`${baseUrl}/admins/mainDocuments/all`,{
    method: 'get',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    }
  })
  return response.json()
}


export async function getAllCategories(tokenFromReducer: string){
  const response = await fetch (`${baseUrl}/showrooms/categories/all`,{
    method: 'get',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    }
  })
  return response.json()
}

export async function getShowRoomsByCategory(tokenFromReducer: string, category: string){
  const response = await fetch (`${baseUrl}/showrooms/byCategory`,{
    method: 'get',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + tokenFromReducer
    }
  })
  return response.json()
}


