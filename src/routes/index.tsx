import { RouteObject } from "react-router";
import PublicLayout from "./public-layout";
import { UiPage } from "@/pages/ui-page";
import NotFoundPage from "@/pages/not-found-page";
import { ProtectedLayout } from "./protected-layout";
import { HomePage } from "@/pages/public/home/home-page";
import { RegisterPage } from "@/pages/public/auth/register-page";
import { LoginPage } from "@/pages/public/auth/login-page";
import ProfileHomePage from "@/pages/private/profile/home/profile-home-page";

const privateRoutes: RouteObject[] = [
    {
        path: "/profile",
        children: [
            {
                path: 'home',
                element: <ProfileHomePage/>
            }
        ],
    },
];

const publicRoutes: RouteObject[] = [
    {
        path: '/ui',
        element: <UiPage />,
    },
    {
		path: '/',
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
				path: 'login',
				element: <LoginPage />,
			}
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
