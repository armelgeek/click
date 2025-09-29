import VapoFooter from "@/components/organisms/vapo-footer";
import VapoHeader from "@/components/organisms/vapo-header";
import { Outlet } from "react-router";
export default function PublicLayout() {
    return (
        <>
            <VapoHeader />
            <div className="z-10 relative w-full h-full bg-white">
                <Outlet />
            </div>
            <VapoFooter />
        </>
    );
}
