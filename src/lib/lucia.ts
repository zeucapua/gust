import { Lucia } from "lucia";
import { Google } from "arctic";
import { adapter } from "./drizzle";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: { secure: import.meta.env.PROD }
  },
  getUserAttributes: (attributes) => {
    return {
      googleId: attributes.google_id,
      username: attributes.username
    };
  }
});

export const google = new Google(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  import.meta.env.DEV 
    ? "http://localhost:4321/auth/google/callback" 
    : "https://gust.page/auth/google/callback"
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  google_id: string;
  username: string;
}
