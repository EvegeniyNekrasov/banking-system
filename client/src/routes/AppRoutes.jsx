import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/"
                    element={<DashboardPage />}
                />
            </Routes>
        </BrowserRouter>
    )
}