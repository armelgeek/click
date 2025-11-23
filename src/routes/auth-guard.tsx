
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { useSession } from "@/shared/config/auth.config";
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router";

export function AuthGuard() {
    const { data: session, isPending } = useSession();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('returnTo');

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    const authPages = ['/login'];
    if (session && authPages.includes(location.pathname)) {
        if (returnTo) {
            return <Navigate to={returnTo} replace />;
        }
        return <Navigate to="/profile/home" replace />;
    }

    return <Outlet />;
}