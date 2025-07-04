import { API_URL } from "../constants/api";
import { Destination } from "~/interfaces/destination";

export async function fetchDestinationData(token: string): Promise<Destination[]> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
