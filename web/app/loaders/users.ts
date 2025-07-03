import { json } from "@remix-run/node";
import { API_URL } from "~/constants/api";
import { User } from "~/interfaces/user"; // Importa la interfaz

export const loader = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Response("Error al cargar los usuarios", { status: response.status });
  }

  const users: User[] = await response.json(); // Tipar los datos como `User[]`
  return json(users); // Devuelve los datos como JSON
};


