import { baseUrl } from "./base-url";

export async function registrationFromNumber(number: string) {
  console.log(number, "number from api");
  try {
    const response = await fetch(`${baseUrl}/authorization/user/send-sms`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: number,
      }),
    });
    return response.json();
  } catch (e) {
    console.log(e, "registration error");
  }
}
