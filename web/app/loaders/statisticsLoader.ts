import { json, LoaderFunction } from "@remix-run/node";
import { fetchUsersWithPreferencesAndDestinations } from "~/services/statisticsService";
import { getTokenFromCookiesServer } from "~/utils/cookieUtils";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const token = getTokenFromCookiesServer(request);

    if (!token) {
      console.error("Token is required but was not provided");
      return [];
    }

    const response = await fetchUsersWithPreferencesAndDestinations(token);
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching statistics data:", error);
    return json([]);
  }
}; 