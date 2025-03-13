import { URL } from "../../constants/api.js"; // Endret sti om constants ligger et annet sted

export async function register(user) {
  const url = `${URL}auth/register`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return json;
}
