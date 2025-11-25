import React, { lazy, Suspense, useMemo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RouteLoader from "../components/Loader/RouteLoader.jsx";
const Home = lazy(() => import("./Home.jsx"));
const Documentation = lazy(() => import("./Documentation.jsx"));
const NotFound = lazy(() => import("./NotFound.jsx"));

export default function Router() {
    const routes = useMemo(
        () => [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/docs",
                element: <Navigate to="/docs/" replace />,
            },
            {
                path: "/docs/:docName",
                element: <Documentation />,
            },
            {
                path: "*",
                element: <NotFound />
            }
        ],
        []
    );

    return (
        <Suspense fallback={<RouteLoader />}>
            <Routes>
                {routes.map((route, index) => (
                    <Route
                        path={route.path}
                        element={route.element}
                        key={index}
                    />
                ))}
            </Routes>
        </Suspense>
    );
}
