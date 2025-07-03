import { LoaderFunction } from "@remix-run/node";
import { fetchPreferencesData } from "~/services/preferenceService";
import { getTokenFromCookiesServer } from "~/utils/cookieUtils";

export const preferencesLoader: LoaderFunction = async ({ request }) => {
  try {
    const token = getTokenFromCookiesServer(request);

    if (!token) {
      console.error("Token is required but was not provided");
      return [];
    }

    const preferencesData = await fetchPreferencesData(token);
    return new Response(JSON.stringify(preferencesData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in preferencesLoader:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
