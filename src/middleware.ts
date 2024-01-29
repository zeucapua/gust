import { defineMiddleware } from "astro:middleware";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "./lib/lucia";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method !== "GET") {
    const origin_header = context.request.headers.get("Origin");
    const host_header = context.request.headers.get("Host");
    if (!origin_header || !host_header || !verifyRequestOrigin(origin_header, [host_header])) {
      return new Response(null, { status: 403 });
    }
  }

  const session_id = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!session_id) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(session_id);
  if (session?.fresh) {
    const session_cookie = lucia.createSessionCookie(session.id);
    context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);
  }

  if (!session) {
    const session_cookie = lucia.createBlankSessionCookie();
    context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);
  }

  context.locals.session = session;
  context.locals.user = user;

  return next();
});
