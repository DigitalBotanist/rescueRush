import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        cors: false,
        proxy: {
            "/api": "http://localhost:4000",
        },
        // https: {
        //   key: fs.readFileSync(path.resolve(__dirname, '../certs/key.pem')),
        //   cert: fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem')),
        // },
        // host: true,
    },
});
