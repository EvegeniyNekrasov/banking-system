import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user)
        return (
            <Navigate
                to={"/login"}
                replace
            />
        );
    return <Outlet />;
}
