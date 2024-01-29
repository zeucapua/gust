import { generateCodeVerifier, generateState } from "arctic";
import { google } from "../../../lib/lucia";
import type { APIContext } from "astro";

export async function GET(context : APIContext): Promise<Response> {
  const state = generateState();
  const code_verifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, code_verifier, { scopes: ["profile"] });

  context.cookies.set("google_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    sameSite: "lax"
  });

  context.cookies.set("code_verifier", code_verifier, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 60 // 1 hour
  });
  
  return context.redirect(url.toString());
}
