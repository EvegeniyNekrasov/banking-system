import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("app")).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </QueryClientProvider>
);
