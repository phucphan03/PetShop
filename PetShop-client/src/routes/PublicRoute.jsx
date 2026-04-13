import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwt";

export default function PublicRoute({ children }) {
    const user = getUserFromToken();

    // đã login thì không cho vào login nữa
    if (user) {
        // redirect theo role
        if (user.role === "Staff" || user.role === "Admin") {
            return <Navigate to="/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}