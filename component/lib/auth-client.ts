import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /**
     * Point to the Next.js app itself, NOT the external API.
     * All /api/auth/* requests are proxied server-side → eliminates CORS.
     */
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}) 

export const { signIn, signUp, useSession, signOut } = authClient