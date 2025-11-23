import AboutPage from '@/pages/public/general/about-page';

import OrderHistoryPage from '@/pages/public/orders/order-history-page';
import OrderListPage from '@/pages/public/orders/order-list-page';
import OrderReturnPage from '@/pages/public/orders/order-return-page';
import { RouteObject } from "react-router";
import PublicLayout from "./public-layout";
import { UiPage } from "@/pages/public/general/ui-page";
import NotFoundPage from "@/pages/public/general/not-found-page";
import { ProtectedLayout } from "./protected-layout";
import { shopRoutes } from "./shop-routes";
import { productRoutes } from "./product-routes";
import { HomePage } from "@/pages/public/home/home-page";
import { RegisterPage } from "@/pages/public/auth/register-page";
import IdentityVerificationPage from "@/pages/public/auth/identity-verification-page";
import { LoginPage } from "@/pages/public/auth/login-page";
import CartPage from '@/pages/public/general/cart-page';
import DeliveryPage from '@/pages/public/general/delivery-page';
import SearchResultsPage from '@/pages/public/general/search-results-page';
import CategoryProductsPage from '@/pages/public/catalog/category-products-page';
import OrderSuccessPage from '@/pages/public/orders/order-success-page';
import OrderTrackingPage from '@/pages/public/orders/order-tracking-page';
import OrderProofPage from '@/pages/public/orders/order-proof-page';
import OrderSignatureProofPage from '@/pages/public/orders/order-signature-proof-page';
import OrderDetailPage from '@/pages/public/orders/order-detail-page';
import ProfileHomePage from "@/pages/private/profile/home/profile-home-page";
import AddressesPage from "@/pages/private/profile/addresses/addresses-page";
import PaymentMethodsPage from "@/pages/private/profile/payment-methods/payment-methods-page";
import { AuthGuard } from "./auth-guard";

const privateRoutes: RouteObject[] = [
    {
        path: "/profile",
        children: [
            {
                path: 'home',
                element: <ProfileHomePage />
            },
            {
                path: 'addresses',
                element: <AddressesPage />
            },
            {
                path: 'payment-methods',
                element: <PaymentMethodsPage />
            }
        ],
    },
    {
        path: '/checkout',
        element: <DeliveryPage />,
    },
];

const publicRoutes: RouteObject[] = [
    {
        path: '/ui',
        element: <UiPage />,
    },
    ...shopRoutes,
    ...productRoutes,
    {
        path: '/cart',
        element: <CartPage />,
    },
    {
        path: '/delivery',
        element: <DeliveryPage />,
    },
    {
        path: '/search-results',
        element: <SearchResultsPage />,
    },
    {
        path: '/category/:categoryId',
        element: <CategoryProductsPage />,
    },
    {
        path: '/order-success/:orderId',
        element: <OrderSuccessPage />,
    },
    {
        path: '/orders/:orderId',
        element: <OrderDetailPage />,
    },
    {
        path: '/orders/:orderId/proofs',
        element: <OrderProofPage />,
    },
    {
        path: '/orders/:orderId/proofs-signature',
        element: <OrderSignatureProofPage />,
    },

    {
        path: '/orders/:orderId/return',
        element: <OrderReturnPage />,
    },
    {
        path: '/orders',
        element: <OrderListPage />,
    },
    {
        path: '/orders-history',
        element: <OrderHistoryPage />,
    },
    {
        path: '/',
        element: <AuthGuard />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: 'identity-verification',
                element: <IdentityVerificationPage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
        ],
    },
];

const routes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            ...publicRoutes,
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                element: <PublicLayout />,
                children: privateRoutes,
            },
        ],
    },
];

export default routes;
