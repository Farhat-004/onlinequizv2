import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db"
import { getUserRoleStateFromDb } from "@/lib/userRoles"
import { ObjectId } from "mongodb";
import { hashPassword, verifyPassword } from "@/lib/password";

function getIdFromUnknownUser(user: unknown): string | null {
    if (!user || typeof user !== "object") return null;
    const record = user as Record<string, unknown>;
    const id = record["id"];
    if (typeof id === "string" && id.length > 0) return id;
    const _id = record["_id"];
    if (typeof _id === "string" && _id.length > 0) return _id;
    return null;
}

type TokenShape = {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    user?: unknown;
    userId?: string;
    error?: string;
    sub?: string;
    role?: string;
};

async function refreshAccessToken(token: TokenShape) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: String(process.env.AUTH_GOOGLE_ID),
                client_secret: String(process.env.AUTH_GOOGLE_SECRET),
                grant_type: "refresh_token",
                refresh_token: String(token.refreshToken),
            });

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens?.access_token,
            accessTokenExpires: Date.now() + refreshedTokens?.expires_in * 1000,
            refreshToken: refreshedTokens?.refresh_token ?? token.refreshToken,
        } satisfies TokenShape;
    } catch (error) {
        console.error(error);

        return { ...token, error: "RefreshAccessTokenError" } satisfies TokenShape;
    }
}
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    trustHost: true,
    session: { strategy: "jwt" },
    // Prevent PKCE verifier cookie from being marked `Secure` on local http,
    // which can lead to "Invalid code verifier" during OAuth callback.
    useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const db = (await client).db();
        const user = (await db.collection("users").findOne({ email })) as
          | { _id: ObjectId; email?: string; name?: string; image?: string; password?: string }
          | null;

        if (!user?.password) return null;
        if (!verifyPassword(password, String(user.password))) return null;

        // Migrate legacy plaintext passwords on successful login.
        if (!String(user.password).startsWith("scrypt:")) {
          await db
            .collection("users")
            .updateOne({ _id: user._id }, { $set: { password: hashPassword(password) } });
        }

        return {
          id: user._id.toString(),
          email: user.email ?? email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // Link Google sign-ins to an existing user with the same verified email
      // (so credentials sign-up and Google OAuth end up as the same account).
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          // "select_account" forces Google’s account picker so sign-in is not silently
          // bound to whichever Google profile is already active in the browser.
          prompt: "consent select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const id = getIdFromUnknownUser(user);
                const rawEmail = (user as { email?: string } | null | undefined)?.email;
                const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : undefined;
                const name = (user as { name?: string } | null | undefined)?.name;
                const image = (user as { image?: string } | null | undefined)?.image;

                // Keep the DB user doc updated with latest Google profile fields.
                // (No-op if user doesn't exist for some reason.)
                if (id && ObjectId.isValid(id)) {
                    const db = (await client).db();
                    await db.collection("users").updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { ...(email ? { email } : {}), ...(name ? { name } : {}), ...(image ? { image } : {}) } },
                    );
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            const t = token as unknown as TokenShape;

            if (account) {
                t.accessToken = account?.access_token;
                t.accessTokenExpires = Date.now() + (account?.expires_in ?? 0) * 1000;
                t.refreshToken = account?.refresh_token;
            }

            if (user) {
                // Persist the adapter user id for server-side APIs
                // (client code in this repo expects `session.userId`).
                const userId = getIdFromUnknownUser(user);
                if (userId) t.userId = userId;
                t.user = user;
                // New sign-in (or account switch): do not reuse role from a previous user
                // merged into the same JWT object.
                delete t.role;
            }

            if (!t.role) {
                const state = await getUserRoleStateFromDb(t.userId ?? t.sub ?? null);
                t.role = state.activeRole;
            }

            if (typeof t.accessTokenExpires === "number" && Date.now() < t.accessTokenExpires) {
                return token;
            }

            if (!t.refreshToken) return token;
            return (await refreshAccessToken(t)) as unknown as typeof token;
        },
        async session({ session, token, user }) {
            const t = (token as unknown as TokenShape) ?? {};

            // Always prioritize token user data to ensure we have the current user
            if (t.user) {
                session.user = t.user as unknown as typeof session.user;
            } else if (user) {
                session.user = user as unknown as typeof session.user;
            }

            const userIdFromUser = getIdFromUnknownUser(user);
            const userIdFromSessionUser = getIdFromUnknownUser(session.user);
            const userId = userIdFromUser ?? t.userId ?? t.sub ?? userIdFromSessionUser;

            (session as unknown as Record<string, unknown>)["userId"] = userId ?? null;
            (session as unknown as Record<string, unknown>)["accessToken"] = t.accessToken ?? null;
            (session as unknown as Record<string, unknown>)["error"] = t.error ?? null;
            const roleState = await getUserRoleStateFromDb(userId ?? null);
            const sess = session as unknown as Record<string, unknown>;
            sess["role"] = roleState.activeRole;
            sess["roles"] = roleState.roles;
            sess["hasBothRoles"] = roleState.hasBothRoles;

            return session;
        },
    },
  
  secret: process.env.AUTH_SECRET,
})
