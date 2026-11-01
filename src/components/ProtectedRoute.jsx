// ======================================================
// FILE: ProtectedRoute.jsx
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Prevents unauthorized users from accessing protected
// dashboard routes.
//
// SECURITY CHECK:
// • Looks for authentication token
// • Checks localStorage
// • Checks sessionStorage
// • Redirects unauthenticated users to /login
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasAuthToken } from "../utils/authSession";


// ======================================================
// PROTECTED ROUTE COMPONENT
// ======================================================

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken);

    useEffect(() => {
        const syncAuthentication = () => setIsAuthenticated(hasAuthToken());
        window.addEventListener("cf-auth-change", syncAuthentication);
        window.addEventListener("storage", syncAuthentication);

        return () => {
            window.removeEventListener("cf-auth-change", syncAuthentication);
            window.removeEventListener("storage", syncAuthentication);
        };
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


// ======================================================
// EXPORT
// ======================================================

export default ProtectedRoute;