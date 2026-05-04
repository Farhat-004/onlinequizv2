import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db"
import { ObjectId } from "mongodb";

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

async function getUserRoleFromDb(id: string | null | undefined): Promise<string | null> {
    if (!id) return null;
    try {
        const db = (await client).db();
        const _id = ObjectId.isValid(id) ? new ObjectId(id) : null;
        if (!_id) return null;
        const user = await db.collection("users").findOne(
            { _id },
            { projection: { role: 1 } },
        );
        const role = (user as { role?: unknown } | null)?.role;
        return typeof role === "string" && role.length > 0 ? role : null;
    } catch {
        return null;
    }
}

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
        console.log(error);

        return { ...token, error: "RefreshAccessTokenError" } satisfies TokenShape;
    }
}
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    trustHost: true,
    // Prevent PKCE verifier cookie from being marked `Secure` on local http,
    // which can lead to "Invalid code verifier" during OAuth callback.
    useSecureCookies: process.env.NODE_ENV === "production",
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
     authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
  })],
callbacks: {
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
            }

            if (!t.role) {
                const role = await getUserRoleFromDb(t.userId ?? t.sub ?? null);
                if (role) t.role = role;
            }

            if (typeof t.accessTokenExpires === "number" && Date.now() < t.accessTokenExpires) {
                return token;
            }

            if (!t.refreshToken) return token;
            return (await refreshAccessToken(t)) as unknown as typeof token;
        },
        async session({ session, token, user }) {
            const t = (token as unknown as TokenShape) ?? {};

            // With a database session strategy (common with adapters), `user` is provided
            // and `token` may be undefined. Do not clobber `session.user` unless we have one.
            if (t.user) {
                session.user = t.user as unknown as typeof session.user;
            }

            const userIdFromUser = getIdFromUnknownUser(user);
            const userIdFromSessionUser = getIdFromUnknownUser(session.user);
            const userId = userIdFromUser ?? t.userId ?? t.sub ?? userIdFromSessionUser;

            (session as unknown as Record<string, unknown>)["userId"] = userId ?? null;
            (session as unknown as Record<string, unknown>)["accessToken"] = t.accessToken ?? null;
            (session as unknown as Record<string, unknown>)["error"] = t.error ?? null;
            (session as unknown as Record<string, unknown>)["role"] =
                t.role ?? (await getUserRoleFromDb(userId ?? null)) ?? "student";

            return session;
        },
    },
  
  secret: process.env.AUTH_SECRET,
})
