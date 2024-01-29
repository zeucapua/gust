import { lucia } from "../lib/lucia";
import type { APIContext } from "astro";

export async function POST(context : APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, { status: 401 });
  }

  await lucia.invalidateSession(context.locals.session.id);

  const session_cookie = lucia.createBlankSessionCookie();
  context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);

  return context.redirect("/");
}
