import { getUserFromToken } from "../utils/jwt";
import { Navigate } from "react-router-dom";
export default function RoleRedirect({ children }) {
    const user = getUserFromToken();

    if (user?.role === "Staff" || user?.role === "Admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}