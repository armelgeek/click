import { authClient } from "@/shared/config/auth.config";

export async function socialSignIn(provider: string, options?: {
    callbackURL?: string;
    errorCallbackURL?: string;
    newUserCallbackURL?: string;
    disableRedirect?: boolean;
}) {
    return authClient.signIn.social({
        provider,
        ...options,
        callbackURL:  `${window.location.origin}`
    });
}