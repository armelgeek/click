import VapoFooter from "@/components/organisms/vapo-footer";
import VapoHeader from "@/components/organisms/vapo-header";
import { Outlet } from "react-router";
import { CartDrawer } from "@/app/cart";

export default function PublicLayout() {
    return (
        <>
            <VapoHeader />
            <CartDrawer />
            <div className="z-10 relative w-full h-full bg-[#e8f1e8]">
                <Outlet />
            </div>
            <VapoFooter />
        </>
    );
}
