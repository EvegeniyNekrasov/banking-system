import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 7777,
        proxy: {
            "/api": {
                target: "http://localhost:6969",
                changeOrigin: true,
                secure: false,
                resrite: (p) => p.replace(/^\/api/, ""),
            },
        },
    },
});
