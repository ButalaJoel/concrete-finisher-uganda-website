import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// ======================================================
// VITE CONFIGURATION
// ======================================================

export default defineConfig({

    plugins: [
        react()
    ],


    // ==================================================
    // DEVELOPMENT SERVER
    //
    // host: true
    //
    // Allows other devices on the same Wi-Fi network
    // to access the React application.
    //
    // Example:
    //
    // Computer:
    // http://localhost:5173
    //
    // Phone:
    // http://10.247.243.70:5173
    // ==================================================

    server: {

        host: true,

        

    }

});