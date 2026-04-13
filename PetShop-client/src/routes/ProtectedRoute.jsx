import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwt";

export default function ProtectedRoute({ children, role }) {
    const user = getUserFromToken();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && !role.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}