import { eq } from "drizzle-orm";
import { db } from "../../../lib/drizzle";
import * as schema from "../../../lib/schema";

import { generateId } from "lucia";
import { google, lucia } from "../../../lib/lucia";
import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";

export async function GET(context : APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const stored_state = context.cookies.get("google_oauth_state")?.value ?? null;
  const stored_code_verifier = context.cookies.get("code_verifier")?.value ?? null;

  if (!code || !stored_state || !stored_code_verifier || state !== stored_state) {
    throw new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, stored_code_verifier);
    const google_user_response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });

    const google_user : GoogleUser = await google_user_response.json();
    const existing_user = await db.query.user.findFirst({ 
      where: eq(schema.user.google_id, google_user.sub)
    });

    if (existing_user) {
      const session = await lucia.createSession(existing_user.id, {});
      const session_cookie = lucia.createSessionCookie(session.id);
      context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);
      return context.redirect("/app/dashboard");
    }

    const user_id = generateId(15);
    await db.insert(schema.user).values({
      id: user_id,
      google_id: google_user.sub,
      username: google_user.name,
    });

    const session = await lucia.createSession(user_id, {});
    const session_cookie = lucia.createSessionCookie(session.id);
    context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);
    return context.redirect("/app/dashboard");
  } 
  catch (e) {
    if (e instanceof OAuth2RequestError) {
      console.log({ e });
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}

interface GoogleUser {
  sub: string;
  name: string;
  picture: string;
}
