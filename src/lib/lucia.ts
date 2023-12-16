import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { postgres } from "@lucia-auth/adapter-postgresql";
import { google } from "@lucia-auth/oauth/providers";

import { query_client } from "./drizzle";

export const auth = lucia({
  adapter: postgres(query_client, {
    user: "auth_user",
    key: "user_key",
    session: "user_session"
  }),
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),

  getUserAttributes: (data) => {
    return { 
      username: data.username
    }
  }
});

export const google_auth = google(auth, {
  clientId: import.meta.env.GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
  redirectUri: import.meta.env.DEV ? 
    "http://localhost:4321/auth/google/callback" 
    : "https://gust.page/auth/google/callback"
});

export type Auth = typeof auth;
