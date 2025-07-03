import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("token", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
