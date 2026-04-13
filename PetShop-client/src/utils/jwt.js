export const getUserFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        return {
            email: payload.email,
            role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        };
    } catch {
        return null;
    }
};