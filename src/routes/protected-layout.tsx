import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { useSession } from "@/shared/config/auth.config";
import { Navigate, Outlet } from "react-router";
export function ProtectedLayout() {
    const { data: session, isPending } = useSession();
    if (isPending) {
        return <LoadingSpinner size={48} />;
    }
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}