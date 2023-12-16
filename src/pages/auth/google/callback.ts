import { auth, google_auth } from "../../../lib/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const storedState = context.cookies.get("google_oauth_state").value;
	const state = context.url.searchParams.get("state");
	const code = context.url.searchParams.get("code");
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, googleUser, createUser } =
			await google_auth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: googleUser.name
				}
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		context.locals.auth.setSession(session);
		return context.redirect("/app/dashboard", 302); 
    
	} catch (e) {
		if (e instanceof OAuthRequestError) {
      console.error({ e });
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
    console.error({ e });
		return new Response(null, {
			status: 500
		});
	}
}
