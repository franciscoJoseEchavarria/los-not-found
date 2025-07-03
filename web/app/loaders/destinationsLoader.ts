import { json, LoaderFunction } from "@remix-run/node";
import { fetchDestinationData } from "~/services/destinationService";
import { getTokenFromCookiesServer } from "~/utils/cookieUtils";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No cookies found" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = getTokenFromCookiesServer(request)

        if (!token) {
          console.error("Token is required but was not provided");
          return [];
        }

    const response = await fetchDestinationData(token);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return json([]);
  }
};
