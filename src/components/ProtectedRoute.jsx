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

import { Navigate } from "react-router-dom";


// ======================================================
// PROTECTED ROUTE COMPONENT
// ======================================================

function ProtectedRoute({ children }) {


    // ==================================================
    // CHECK PERSISTENT AUTHENTICATION
    //
    // Used when "Remember Me" was selected during login.
    // ==================================================

    const persistentToken = localStorage.getItem(
        "cf_auth_token"
    );


    // ==================================================
    // CHECK SESSION AUTHENTICATION
    //
    // Used when "Remember Me" was NOT selected.
    // ==================================================

    const sessionToken = sessionStorage.getItem(
        "cf_auth_token"
    );


    // ==================================================
    // GET AVAILABLE TOKEN
    // ==================================================

    const token = persistentToken || sessionToken;


    // ==================================================
    // BLOCK UNAUTHORIZED ACCESS
    // ==================================================

    if (!token) {

        return (

            <Navigate
                to="/login"
                replace
            />

        );

    }


    // ==================================================
    // ALLOW AUTHORIZED ACCESS
    // ==================================================

    return children;


}


// ======================================================
// EXPORT
// ======================================================

export default ProtectedRoute;