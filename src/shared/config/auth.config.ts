import { createAuthClient } from 'better-auth/react'
import {
    inferAdditionalFields
} from 'better-auth/client/plugins'
export const authClient = createAuthClient({
    baseURL: `${import.meta.env.VITE_APP_SERVER_URL}/api/auth`,
    plugins: [
        inferAdditionalFields({
            user: {
                phoneNumber: { type: 'string' },
                role: { type: 'string' },
                birthday: { type: 'string' },
            },
        })
    ],
})

export const { signIn, signUp, signOut, useSession } = authClient
