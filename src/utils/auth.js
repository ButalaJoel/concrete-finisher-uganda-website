export const getAuthHeaders = () => {
    const token =
        localStorage.getItem("cf_auth_token") ||
        sessionStorage.getItem("cf_auth_token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};
