const API_URL = "https://fake-json-api.mock.beeceptor.com/users/"
export async function getUsers() {
 const response = await fetch(API_URL)
 if (!response.ok) {
 throw new Error("No se pudo obtener la información")
 }
 return response.json()
}