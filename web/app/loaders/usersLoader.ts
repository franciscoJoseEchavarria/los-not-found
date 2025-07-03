import { json, LoaderFunction } from "@remix-run/node";
import { fetchAllUsersData } from "~/services/userService";
import { getTokenFromCookiesServer } from "~/utils/cookieUtils";

export const usersLoader: LoaderFunction = async ({ request }) => {
  try {
    const token = getTokenFromCookiesServer(request)

    if (!token) {
      console.error("Token is required but was not provided");
      return [];
    }

    const response = await fetchAllUsersData(token);

    if (!Array.isArray(response)) {
      return new Response(
        JSON.stringify({ error: "Data format is invalid" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return json([]);
  }
};
