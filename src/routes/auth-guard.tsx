import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { useSession } from "@/shared/config/auth.config";
import { Navigate, Outlet, useLocation } from "react-router";

export function AuthGuard() {
    const { data: session, isPending } = useSession();
    const location = useLocation();
    
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size={48} />
            </div>
        );
    }
    
    const authPages = ['/login'];
    if (session && authPages.includes(location.pathname)) {
        return <Navigate to="/profile/home" replace />;
    }
    
    return <Outlet />;
}