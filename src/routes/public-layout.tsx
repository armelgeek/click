import VapoFooter from "@/components/organisms/VapoFooter";
import VapoHeader from "@/components/organisms/VapoHeader";
import { Outlet } from "react-router";
export default function PublicLayout() {
    return (
        <>
            <VapoHeader />
            <div className="z-10 relative w-full h-full">
                <Outlet />
            </div>
            <VapoFooter />
        </>
    );
}
