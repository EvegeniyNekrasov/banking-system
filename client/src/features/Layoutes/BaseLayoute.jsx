import { Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function BaseLayout() {
    const { user, logout } = useAuth();
    return (
        <div>
            <header>
                <h1>Banking system</h1>
                <span>{user.email}</span>
                <button
                    type="button"
                    onClick={logout}>
                    logout
                </button>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
