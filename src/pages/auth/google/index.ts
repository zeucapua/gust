import { google_auth } from "../../../lib/lucia";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const [ url, state ] = await google_auth.getAuthorizationUrl();

  context.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: 60 * 60
  });

  return context.redirect(url.toString(), 302);
}
