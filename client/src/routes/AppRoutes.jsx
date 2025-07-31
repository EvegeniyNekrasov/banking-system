import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import BaseLayout from "../features/Layoutes/BaseLayoute";

const Login = React.lazy(() => import("../features/auth/LoginPage"));
const Dashboard = React.lazy(() =>
    import("../features/dashboard/DashboardPage")
);

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route element={<ProtectedRoute />}>
                    <Route element={<BaseLayout />}>
                        <Route
                            index
                            element={<Dashboard />}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
