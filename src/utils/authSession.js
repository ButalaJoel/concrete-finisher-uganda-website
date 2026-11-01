export const hasAuthToken = () =>
    Boolean(
        localStorage.getItem("cf_auth_token") ||
        sessionStorage.getItem("cf_auth_token")
    );

export const clearAuthSession = () => {
    localStorage.removeItem("cf_auth_token");
    localStorage.removeItem("cf_admin");
    sessionStorage.removeItem("cf_auth_token");
    sessionStorage.removeItem("cf_admin");
    window.dispatchEvent(new Event("cf-auth-change"));
};
