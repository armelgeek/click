import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
    baseURL: `${import.meta.env.VITE_APP_SERVER_URL}/api/auth`,
    plugins: [],
})

export const { signIn, signUp, signOut, useSession } = authClient
