import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/*
    TODO: this is only provosional. Refactor later
*/

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const check_session = async () => {
            try {
                const res = await fetch("/api/auth/current-user", {
                    method: "POST",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                // TODO
            } finally {
                setLoading(false);
            }
        };

        check_session();
    }, []);

    const login = async (username, password) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setUser(data);
            return true;
        }

        return false;
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout/", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            // TODO
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// TODO?: extract to external file
export function useAuth() {
    return useContext(AuthContext);
}
