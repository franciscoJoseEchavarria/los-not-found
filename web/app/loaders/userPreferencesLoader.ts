import { LoaderFunctionArgs } from "@remix-run/node";

export async function userPreferencesLoader({ params }: LoaderFunctionArgs) {
  const { email } = params;
  if (!email) throw new Response("Email is required", { status: 400 });

  try {
    const response = await fetch(`http://localhost:8084/api/v1/preferencias/usuario/${email}`);
    if (!response.ok) throw new Error("Error fetching user preferences");

    const preferencias = await response.json();
    return preferencias;
  } catch (error) {
    console.error("Error in userPreferencesLoader:", error);
    return [];
  }
}
