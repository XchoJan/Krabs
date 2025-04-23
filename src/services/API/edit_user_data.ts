import { baseUrl } from "./base-url";

export async function editUserData(data: any) {
    const response = await fetch(`${baseUrl}/authorization/user/confirmation-code`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
