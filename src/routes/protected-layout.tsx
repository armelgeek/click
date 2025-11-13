import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { useSession } from "@/shared/config/auth.config";
import { Navigate, Outlet, useLocation } from "react-router";
export function ProtectedLayout() {
    const { data: session, isPending } = useSession();
    const location = useLocation();
    if (isPending) {
        return <LoadingSpinner size={48} />;
    }
    if (!session) {
        // Redirect to login with returnTo parameter to come back here after login
        return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
    }
    return <Outlet />;
}